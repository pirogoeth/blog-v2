import { Octokit } from 'octokit';
import { RedisCache, type Options as RedisCacheOptions } from './cache';
import type { Post, PostDetail, PostMetadata } from './models';
import { Logger, type ILogObj } from 'tslog';
import { type RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import * as yaml from 'js-yaml'
import type { Synopsizer } from './synopsizer';
import { digestText } from './utils';

type ListGistsResponse =
  RestEndpointMethodTypes["gists"]["list"]["response"];
type GistsList = ListGistsResponse["data"];
type GistsListItem = ListGistsResponse["data"][0];
type GetGistResponse =
  RestEndpointMethodTypes["gists"]["get"]["response"];

const log: Logger<ILogObj> = new Logger();
const cacheKeys: Record<string, string> = {
  allPosts: 'postFeed:allPostIds',
  category: 'postFeed:category',
  post: 'postFeed:post',
  postSlug: 'postFeed:postSlug',
  rawGists: 'postFeed:rawGists',
  rawMetadata: 'postFeed:rawMetadata',
  rawPost: 'postFeed:rawPost',
};
const postListExpirationTime = process.env.POST_LIST_EXPIRATION_TIME ?? (60 * 60);

export interface PingResult {
  status: string,
  message?: string,
};

export interface PostFeed<T> {
  fetchPosts(opts?: T): Promise<PostFeedResponse>
  fetchPostById(id: string, opts?: T): Promise<Post|null>
  fetchPostBySlug(slug: string, opts?: T): Promise<Post|null>
  ping(): Promise<PingResult>
};

export interface GistPostFeedOptions {
  githubToken: string,
  synopsizer: Synopsizer,
  cacheOptions?: RedisCacheOptions,
};

export interface PostFeedResponse {
  posts: Post[],
  count: number,
};

export interface PostFetchOptions {
  ignoreCached?: boolean,
  returnPostText?: boolean,
};

export class GistPostFeed implements PostFeed<PostFetchOptions> {
  client: Octokit
  synopsizer: Synopsizer
  cache?: RedisCache

  constructor(opts: GistPostFeedOptions) {
    this.client = new Octokit({ auth: opts.githubToken });
    this.synopsizer = opts.synopsizer;
    if (opts.cacheOptions) {
      this.cache = new RedisCache(opts.cacheOptions);
    }
  }

  /*
   * PUBLIC INTERFACE
   */

  async ping(): Promise<PingResult> {
    const { data: { login } } = await this.client.rest.users.getAuthenticated();
    return {
      status: 'ok',
      message: `Authenticated as ${login}`,
    };
  }

  async fetchPosts(opts: PostFetchOptions): Promise<PostFeedResponse> {
    const ignoreCached = opts?.ignoreCached ?? false;

    let posts = await this.convertGists(await this.getPostGists(ignoreCached), opts)
      .then(posts => {
        return posts.map(async postPromise => {
          if (!opts.returnPostText) {
            postPromise.then(post => {
              return Object.assign({}, post, {text: ''});
            })
          }

          return postPromise;
        });
      });

    return {
      posts: await Promise.all(posts),
      count: posts.length,
    };
  }

  async fetchPostById(id: string, opts: PostFetchOptions): Promise<Post|null> {
    let post: Post|null = null;
    if (!opts.ignoreCached) {
      post = JSON.parse(await this.cache?.keyGet(`${cacheKeys.post}:${id}`) ?? 'null');
    }
    if (post === null) {
      // TODO: Try to scrape post out of fetchPosts result
      throw 'not implemented';
    }

    console.log('Returning post', post);

    return post;
  }

  async fetchPostBySlug(slug: string, opts: PostFetchOptions): Promise<Post|null> {
    let postId = null;
    if (!opts.ignoreCached) {
      postId = await this.cache?.keyGet(`${cacheKeys.postSlug}:${slug}`);
    }
    if (postId === null) {
      // TODO: Try to scrape post out of fetchPosts result
      throw 'not implemented';
    }

    return await this.fetchPostById(postId!, opts);
  }

  /*
   * IMPLEMENTATION DETAILS
   */

  gistFilter(gist: GistsListItem): GistsListItem|null {
    if (gist.description?.includes('[blog]')) {
      let files = gist.files;
      if ('meta.yml' in files && 'post.md' in files) {
        return gist;
      }
    }

    return null;
  }

  async getPostGists(ignoreCached: boolean): Promise<GistsList> {
    let gists: GistsList;
    let rawGists = await this.cache?.keyGet(`${cacheKeys.rawGists}`);
    if (rawGists !== null && ignoreCached === false) {
      gists = JSON.parse(rawGists ?? '[]');
    } else {
      gists = (await this.client.rest.gists.list()).data;
      await this.cache?.keySet(`${cacheKeys.rawGists}`, JSON.stringify(gists), { EX: postListExpirationTime });
    }

    return gists.filter(gist => this.gistFilter(gist));
  }

  async convertGists(gists: GistsList, opts: PostFetchOptions): Promise<Promise<Post>[]> {
    return gists.map(async gist => await this.cachePost(this.createPostFromGist(gist, opts)));
  }

  async cachePost(post: Promise<Post>): Promise<Post> {
    post.then(async post => {
      console.log('What if it\'s earlier?', post);
      await this.cache?.setAdd(cacheKeys.allPosts, [post.metadata.detail.id]);
      const toCache = JSON.stringify(post);
      console.log('This is what will be cached', toCache);
      await this.cache?.keySet(`${cacheKeys.post}:${post.metadata.detail.id}`, toCache);
      console.log('This is what was cached', await this.cache?.keyGet(`${cacheKeys.post}:${post.metadata.detail.id}`));
      await this.cache?.keySet(`${cacheKeys.postSlug}:${post.metadata.slug}`, post.metadata.detail.id);
      for (const category of post.metadata.categories) {
        await this.cache?.setAdd(`${cacheKeys.category}:${category.toLowerCase()}`, [post.metadata.detail.id]);
      }
    });
    return post;
  }

  async loadPostMetadata(gist: GistsListItem, opts: PostFetchOptions): Promise<PostMetadata> {
    const ignoreCached = opts.ignoreCached;

    let metadataUrl = gist.files['meta.yml'].raw_url!;
    let rawMetadata = await this.cache?.keyGet(`${cacheKeys.rawMetadata}:${digestText(metadataUrl)}`);
    if (rawMetadata === null || ignoreCached) {
      log.silly(`Fetching metadata from ${metadataUrl}`);
      rawMetadata = await (await (await fetch(metadataUrl!)).blob()).text();
      await this.cache?.keySet(`${cacheKeys.rawMetadata}:${digestText(metadataUrl)}`, rawMetadata);
    }

    let metadata: PostMetadata = {};
    metadata.detail = {
      createdAt: gist.created_at,
      description: gist.description,
      id: gist.id,
      isPublic: gist.public,
      updatedAt: gist.updated_at,
      author: {
        avatarUrl: gist.owner?.avatar_url,
        name: gist.owner?.name,
        email: gist.owner?.email,
      },
    };
    if (rawMetadata !== undefined) {
      metadata = Object.assign(metadata, yaml.load(rawMetadata));
    } 

    return metadata;
  }

  async loadPostText(gist: GistsListItem, opts: PostFetchOptions): Promise<string> {
    let postTextUrl = gist.files['post.md'].raw_url!;
    let rawPost = await this.cache?.keyGet(`${cacheKeys.rawPost}:${digestText(postTextUrl)}`);
    if (rawPost === null || opts.ignoreCached) {
      log.silly(`Fetching post text from ${postTextUrl}`);
      rawPost = await (await (await fetch(postTextUrl!)).blob()).text();
      await this.cache?.keySet(`${cacheKeys.rawPost}:${digestText(postTextUrl)}`, rawPost);
    }

    if (rawPost === undefined) {
      throw 'a gist exists for this post, but is missing a `post.md` file';
    }

    return rawPost;
  }

  async enrichPostMetadata(post: Post, opts: PostFetchOptions): Promise<Post> {
    let splitText = post.text?.split(' ') ?? [];
    post.metadata.metrics = {
      minutesRead: (splitText.length / 225).toFixed(1),
      wordCount: splitText.length,
    };

    if ('synopsis' in post.metadata) {
      post.synopsis = post.metadata.synopsis as string;
    } else {
      post.synopsis = await this.synopsizer.generateSynopsis(post.text);
    };

    return post;
  }

  async createPostFromGist(gist: GistsListItem, opts: PostFetchOptions): Promise<Post> {
    let postResolver: Promise<Post> = Promise.all([this.loadPostMetadata(gist, opts), this.loadPostText(gist, opts)])
      .then(([metadata, text]) => {
        return {
          metadata,
          text,
          synopsis: '',
        };
      }).then(post => {
        return this.enrichPostMetadata(post, opts);
      });

    return await postResolver;
  }
};
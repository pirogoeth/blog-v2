import { Octokit } from 'octokit';
import { RedisCache, type Options as RedisCacheOptions } from './cache';
import type { Post, PostDetail, PostMetadata } from './models';
import { Logger, type ILogObj } from 'tslog';
import { type RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import * as yaml from 'js-yaml'
import type { Synopsizer } from './synopsizer';
import { digestText } from './utils';

type ListGistsReponse =
  RestEndpointMethodTypes["gists"]["list"]["response"];
type ListGistItem = ListGistsReponse["data"][0];
type GetGistResponse =
  RestEndpointMethodTypes["gists"]["get"]["response"];
type GetGistItem = GetGistResponse["data"];

const log: Logger<ILogObj> = new Logger();
const cacheKeys: Record<string, string> = {
  allPosts: 'postFeed:allPosts',
  category: 'postFeed:category',
  post: 'postFeed:post',
  rawMetadata: 'postFeed:rawMetadata',
  rawPost: 'postFeed:rawPost',
};

export interface PingResult {
  status: string,
  message?: string,
};

export interface PostFeed {
  fetchPosts(): Promise<PostFeedResponse>
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

export class GistPostFeed implements PostFeed {
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

  async ping(): Promise<PingResult> {
    const { data: { login } } = await this.client.rest.users.getAuthenticated();
    return {
      status: 'ok',
      message: `Authenticated as ${login}`,
    };
  }

  async fetchPosts(includePostText: boolean = true): Promise<PostFeedResponse> {
    let gists = (await this.client.rest.gists.list()).data;
    // Filter for gists with the `[blog]` tag
    let posts = gists
      .filter(gist => this.gistFilter(gist))
      .map(async gist => await this.gistToPost(gist))
      .map(async postPromise => await this.passthroughCachePost(postPromise))
      .map(async postPromise => {
        if (!includePostText) {
          postPromise.then(post => { post.text = undefined })
        }

        return postPromise;
      });

    return {
      posts: await Promise.all(posts),
      count: posts.length,
    };
  }

  gistFilter(gist: ListGistItem): ListGistItem|null {
    if (gist.description?.includes('[blog]')) {
      let files = gist.files;
      if ('meta.yml' in files && 'post.md' in files) {
        return gist;
      }
    }

    return null;
  }

  async passthroughCachePost(post: Promise<Post>): Promise<Post> {
    post.then(post => {
      this.cache?.setAdd(cacheKeys.allPosts, [post.metadata.post.id]);
      this.cache?.keySet(`${cacheKeys.post}:${post.metadata.post.id}`, JSON.stringify(post));
      for (const category of post.metadata.categories) {
        this.cache?.setAdd(`${cacheKeys.category}:${category.toLowerCase()}`, [post.metadata.post.id]);
      }
    });
    return post;
  }

  async gistToPost(gist: ListGistItem): Promise<Post> {
    let metadataUrl = gist.files['meta.yml'].raw_url!;
    let rawMetadata = await this.cache?.keyGet(`${cacheKeys.rawMetadata}:${digestText(metadataUrl)}`);
    if (rawMetadata === null) {
      log.silly(`Fetching metadata from ${metadataUrl}`);
      rawMetadata = await (await (await fetch(metadataUrl!)).blob()).text();
      await this.cache?.keySet(`${cacheKeys.rawMetadata}:${digestText(metadataUrl)}`, rawMetadata);
    }
    let metadata = Object.assign(
      {},
      rawMetadata !== undefined ? yaml.load(rawMetadata) : {},
      {post: {
        createdAt: gist.created_at,
        description: gist.description,
        id: gist.id,
        isPublic: gist.public,
        updatedAt: gist.updated_at,
        author: {
          avatarUrl: gist.owner?.avatar_url,
          name: gist.owner?.name,
          email: gist.owner?.email,
        }
      }}
    );

    let postTextUrl = gist.files['post.md'].raw_url!;
    let rawPost = await this.cache?.keyGet(`${cacheKeys.rawPost}:${digestText(postTextUrl)}`);
    if (rawPost === null) {
      log.silly(`Fetching post text from ${postTextUrl}`);
      rawPost = await (await (await fetch(postTextUrl!)).blob()).text();
      await this.cache?.keySet(`${cacheKeys.rawPost}:${digestText(metadataUrl)}`, rawPost);
    }

    let synopsis: string;
    if ('synopsis' in metadata) {
      synopsis = metadata.synopsis as string;
    } else {
      synopsis = await this.synopsizer.generateSynopsis(rawPost);
    };

    return {
      metadata,
      synopsis,
      text: rawPost,
    };
  }
};
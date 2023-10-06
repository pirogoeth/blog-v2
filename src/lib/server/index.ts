import { RedisCache } from './cache';
import * as postFeed from './postFeed';
import * as synopsizer from './synopsizer';

import { env } from '$env/dynamic/private';

if (!env.GITHUB_TOKEN) {
  throw "GITHUB_TOKEN env must be set";
}

export const postSynopsizer = synopsizer.init();
const options: postFeed.GistPostFeedOptions = {
  githubToken: env.GITHUB_TOKEN!,
  synopsizer: postSynopsizer,
  cacheOptions: {
    url: env.POST_FEED_REDIS_URL ?? 'redis://localhost:6379/0'
  },
};

export const feed = new postFeed.GistPostFeed(options);
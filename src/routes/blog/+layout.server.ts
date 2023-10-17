import { feed } from '$lib/server';
import type { PostFeedResponse } from '$lib/server/postFeed';
import { Logger, type ILogObj } from 'tslog';

const log = new Logger<ILogObj>();

export async function load({ url }): Promise<PostFeedResponse> {
  let ping = await feed.ping();
  log.info(`Post feed ping: ${ping.message}`);

  const ignoreCached = url.searchParams.get('ignoreCached') ? true : false;
  return await feed.fetchPosts({
    returnPostText: false,
    ignoreCached,
  });
}
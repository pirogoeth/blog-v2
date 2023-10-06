import { feed } from '$lib/server';
import type { PostFeedResponse } from '$lib/server/postFeed';
import { Logger, type ILogObj } from 'tslog';

const log = new Logger<ILogObj>();

export async function load(): Promise<PostFeedResponse> {
  let ping = await feed.ping();
  log.info(`Post feed ping: ${ping.message}`);

  return await feed.fetchPosts();
}
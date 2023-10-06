import { feed } from '$lib/server';
import type { PostFeedResponse } from '$lib/server/postFeed';
import { error } from '@sveltejs/kit';
import { Logger, type ILogObj } from 'tslog';

const log = new Logger<ILogObj>();

export async function load({ parent, params }): Promise<PostFeedResponse> {
  const parentData = await parent();
  console.log(parentData);
  const post = parentData.posts.find(post => post.metadata.slug === params.slug);
  if (!post) {
    throw error(404, 'post not found');
  }

  return { posts: [post], count: 1 };
}
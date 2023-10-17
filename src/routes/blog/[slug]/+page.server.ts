import { feed } from '$lib/server';
import type { Post } from '$lib/server/models';
import { error } from '@sveltejs/kit';
import { Logger, type ILogObj } from 'tslog';

const log = new Logger<ILogObj>();

export async function load({ params, url }): Promise<Post> {
  const ignoreCached = url.searchParams.get('ignoreCached') ? true : false;
  return await feed.fetchPostBySlug(params.slug, {
    ignoreCached,
    returnPostText: true,
  });
}
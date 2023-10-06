<script lang="ts">
  import { Avatar, Heading, P, Span, TextPlaceholder } from 'flowbite-svelte';
  import type { Post } from '$lib/server/models';

  export let post: Post;
  export let loading = true;
</script>

{#if loading}
  <TextPlaceholder size="xxl" class="mt-8" />
{:else}
  <li class="mx-auto">
    <a href="/blog/{post.metadata.slug}">
      <div class="container mx-auto flex items-start columns-8 gap-6 py-4 px-4 rounded transition hover:duration-150 hover:ease-in-out hover:bg-slate-50 dark:hover:bg-slate-950">
        <div class="flex-none">
          <Avatar class="flex-none" src={post.metadata.post.author.avatarUrl} rounded size="lg" />
        </div>
        <div class="flex-1 grow">
          <Heading tag="h5" class="grow">
            <Span underline class="decoration-2 decoration-slate-100 dark:decoration-tangelo underline-offset-2">
              {post.metadata.title}
            </Span>
          </Heading>
          <P weight="light">
            {post.synopsis}
          </P>
          <div class="content-end">
            <P weight="extralight" align="right" italic={true} size="xs">
              15 minute read - written {post.metadata.post.createdAt} - last updated {post.metadata.post.updatedAt}
            </P>
          </div>
        </div>
      </div>
    </a>
  </li>
{/if}
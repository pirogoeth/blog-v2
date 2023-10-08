<script lang="ts">
  import PostPreview from './postPreview.svelte';
  import PageHeading from '../pageHeading.svelte';
  import { Heading, Span } from 'flowbite-svelte';

  export let data;
</script>

<PageHeading text="blog posts" hClass="mb-6 text-center" />
<ul>
  <!-- TODO: Skeleton here -->
  {#if data !== null}
    {#each data.posts as post}
      <li>
        <PostPreview loading={false} post={post} />
      </li>
    {/each}
  {/if}
</ul>
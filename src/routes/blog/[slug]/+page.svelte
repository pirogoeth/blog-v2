<script lang="ts">
  import { Hr, P } from 'flowbite-svelte';
  import Markdown from 'svelte-markdown';
  import PageHeading from '../../pageHeading.svelte';
  import { DateTime } from 'luxon';

  import MarkdownCode from '$lib/markdown/codeWrapper.svelte';
  import MarkdownCodespan from '$lib/markdown/codespan.svelte';
  import MarkdownHeading from '$lib/markdown/heading.svelte';
  import MarkdownImage from '$lib/markdown/image.svelte';
  import MarkdownLink from '$lib/markdown/link.svelte';
  import MarkdownList from '$lib/markdown/list.svelte';
  import MarkdownListItem from '$lib/markdown/listItem.svelte';
  import MarkdownParagraph from '$lib/markdown/paragraph.svelte';

  export let data;
  const post = data.posts[0];
  const wordCount = post.text?.split(' ').length ?? 0;
  const createdAt = DateTime.fromISO(post.metadata.post.createdAt);
  const updatedAt = DateTime.fromISO(post.metadata.post.updatedAt);
</script>

<PageHeading text={post.metadata.title} />
<div class="mx-auto">
  <article class="container mx-auto max-w-3xl gap-6 py-4 px-4">
    <P italic class="text-xs text-center">
      written {createdAt.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} ⋅
      {#if createdAt !== updatedAt}
      updated {updatedAt.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} ⋅
      {/if}
      {wordCount} words ⋅
      {(wordCount / 225).toFixed(1)} minute read
    </P>
    <Hr classHr="w-48 h-1 mx-auto my-4 rounded md:my-10 dark:bg-linen"/>
    <Markdown
      source={post.text ?? ''}
      renderers={{
        code: MarkdownCode,
        codespan: MarkdownCodespan,
        heading: MarkdownHeading,
        image: MarkdownImage,
        paragraph: MarkdownParagraph,
        link: MarkdownLink,
        list: MarkdownList,
        listitem: MarkdownListItem,
      }}
      />
  </article>
</div>
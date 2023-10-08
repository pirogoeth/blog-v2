<script lang="ts">
  import { Img, Span } from 'flowbite-svelte';

  export let href: string;
  export let title: string;
  export let text: string;
</script>

<!-- old attributes

  class="rounded-lg overflow-hidden aspect-square object-none"
  alignment="ml-auto"
  imgClass="h-48"
  captionClass="mt-0 mb-2 text-sm text-gray-500 dark:text-gray-400"

  class="rounded-lg max-w-sm h-48"
  captionClass="relative text-gray-500 dark:text-gray-400"

  captionClass="mt-1 mb-2 text-sm text-center text-gray-500 dark:text-gray-400"

  captionClass="relative bottom-6 px-4 text-lg text-gray-400"
-->

<Img
  src={href}
  alt={title}
  caption={text}
  size="max-w-xs"
  alignment=""
  imgClass="h-auto rounded-lg aspect-square object-none border border-dashed border-gray-400 mt-4"
  figClass="max-w-xs mr-auto ml-auto"
  captionClass="mt-0 mb-4 py-0 text-md text-center text-asperagus dark:text-apricot italic"
  />
<script lang="ts">
  import { Highlight } from 'svelte-highlight';
  import * as languages from 'svelte-highlight/languages';
  import atlas from "svelte-highlight/styles/atlas";

  export let lang: string;
  export let text: string;

  const highlightRule = languages[lang.toLowerCase()] ?? languages['plaintext'];
</script>

<svelte:head>
  {@html atlas}
</svelte:head>

<Highlight language={highlightRule} code={text} class="whitespace-pre-wrap" />
<script lang="ts">
  import MarkdownCode from './code.svelte';
  import MarkdownMagicBlock, { mapTagToComponent } from './magicBlock';

  export let lang: string;
  export let text: string;

  const useMagicBlock = mapTagToComponent(lang) !== null;
</script>

{#if useMagicBlock}
  <MarkdownMagicBlock { lang } { text } />
{:else}
  <MarkdownCode { lang } { text } />
{/if}

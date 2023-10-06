<script lang="ts">
  import type { ComponentType } from 'svelte';
  import ImageGallery from './imageGallery.svelte';
  import { mapTagToComponent } from './map';

  export let lang: string;
  export let text: string;

  const component = mapTagToComponent(lang);
</script>

<svelte:component this={component} {text} />
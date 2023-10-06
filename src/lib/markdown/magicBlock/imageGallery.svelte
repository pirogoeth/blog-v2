<script lang="ts">
  import { Gallery, type ImgType } from 'flowbite-svelte';

  export let text;
  // TODO: Add a structure for the nested text, since it _MUST_ be a JSON body.
  // The nested structure should include an options key, so we can forcibly
  // disable the auto-factoring of the galleries.

  export const images: ImgType[] = JSON.parse(text) as ImgType[];
  // Depending on the number of images, we can factor them down into the
  // nice, staggered, masonry image galleries. At most, we'll do 4 columns.
  // If it doesn't work out into the multi-column split, do a simple gallery and
  // let flowbite take the wheel.
  // Note that this factoring will only take place on the md+ breakpoint!
  var numColumns = 0;
  if (images.length % 4 == 0) {
    numColumns = 4;
  } else if (images.length % 3 == 0) {
    numColumns = 3;
  } else if (images.length % 2 == 0) {
    numColumns = 2;
  }

  let columns: ImgType[][] = [];
  for (let i = 0; i < numColumns && numColumns > 1; i++) {
    columns.push([]);
  }

  let placedImages = 0;
  let columnIdx = 0;
  while (placedImages < images.length && numColumns > 1) {
    columns[columnIdx].push(images[placedImages]);
    columnIdx++;
    placedImages++;

    if (columnIdx >= columns.length) {
      columnIdx = 0;
    }
  }
</script>

{#if numColumns == 0}
<Gallery items={images} class="gap-4 grid-cols-2 md:grid-cols-3" />
{:else}
<Gallery class={`gap-4 grid-cols-2 md:grid-cols-${numColumns}`}>
  {#each columns as column}
  <Gallery items={column} />
  {/each}
</Gallery>
{/if}
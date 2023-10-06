<script lang="ts">
  import { List, Li } from 'flowbite-svelte';

  export let ordered: boolean;
  export let start: number;

  const tag: "ol"|"ul"|"dl" = ordered ? "ol" : "ul";
</script>

<List {tag} {start} class="list-outside">
  <slot />
</List>
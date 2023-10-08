<script lang="ts">
  import { Li, P } from 'flowbite-svelte';
</script>  

<Li class="mb-1 marker:text-verdigris dark:marker:text-verdigris text-inherit dark:text-inherit">
  <P weight="light" class="text-inherit dark:text-inherit">
    <slot />
  </P>
</Li>
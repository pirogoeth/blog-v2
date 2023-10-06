<script lang="ts">
  import { A } from 'flowbite-svelte';

  export let href: string = ''
  export let title: string|undefined = undefined
</script>

<A {href} {title} class="underline hover:no-underline">
  <slot />
</A>
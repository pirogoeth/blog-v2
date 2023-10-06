<script lang="ts">
  import { Heading, Span } from 'flowbite-svelte';

  export let text: string;
</script>

<Heading tag="h2" class="mb-4 text-center">
  <Span underline decorationClass="decoration-4 decoration-green-200 dark:decoration-verdegris">
    {text}
  </Span>
</Heading>

<script lang="ts">
  import { Heading, Span } from 'flowbite-svelte';

  export let text: string;
  export let hClass: string|null;
</script>

<Heading tag="h2" class={hClass ?? "mb-4 text-center"} >
  <Span underline decorationClass="decoration-4 decoration-verdigris dark:decoration-verdigris" class="text-inherit dark:text-inherit">
    {text}
  </Span>
</Heading>

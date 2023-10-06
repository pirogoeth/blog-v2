<script lang="ts">
  import { A, Heading, Span } from 'flowbite-svelte';

  export let text: string;
  export let depth: 1|2|3|4|5|6;

  // In the context of a blog page, the PageHeading component should always be the largest
  // heading on the page, regardless of which markdown heading tags are used.
  // Meaning, anything in the body at h2 or larger should be clamped to h3.
  const clampedDepth: 3|4|5|6 = Math.min(Math.max(depth, 3), 6) as 3|4|5|6;
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
</script>

<Heading tag={`h${clampedDepth}`} class="py-2">
  <A name={escapedText} aClass="anchor" href={`#${escapedText}`}>
    <Span underline class="decoration-1 dark:decoration-linen mb-1 pb-1">
      {text}
    </Span>
  </A>
</Heading>
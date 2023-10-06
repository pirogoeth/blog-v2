<script lang="ts">
  import { page } from '$app/stores';
  import { A, Heading, P, Span } from 'flowbite-svelte';
</script>

<div class="text-center">
  <Span class="relative">
    <Heading tag="h1" class="mb-8 mt-8">
      <Span class="relative">
        <Span class="block absolute px-8 -inset-1 rounded -rotate-12 bg-gradient-to-r from-purple-400 to-blue-500" aria-hidden="true"></Span>
        <Span class="relative text-white">
          {$page.status}
        </Span>
      </Span>
    </Heading>
  </Span>
  <Heading tag="h1" class="mb-4">
    🙃
  </Heading>
  <Span italic class="px-4 py-2 transition duration-200 ease-in-out rounded-lg border-2 border-dashed border-transparent hover:border-slate-900">
    <A class="pt-16" href="/">
      <P>
        Maybe try going back home... ?
      </P>
    </A>
  </Span>
</div>
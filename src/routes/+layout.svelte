<script lang="ts">
  import '../app.postcss';
  import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';

</script>

<Navbar  >
  <NavBrand href="/">
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">seanj.dev</span>
  </NavBrand>
  <NavUl >
    <NavLi href="/">home</NavLi>
    <NavLi href="/blog">blog</NavLi>
  </NavUl>
</Navbar>

<slot />

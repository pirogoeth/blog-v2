<script lang="ts">
  import '../app.postcss';
  import { page } from '$app/stores';
  import { Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';

  $: activeUrl = $page.url.pathname;
</script>

<Navbar class="bg-tangelo dark:bg-tangelo mb-6 text-richBlack dark:text-linen">
  <NavBrand href="/">
    <span class="self-center whitespace-nowrap text-xl font-semibold">seanj.dev</span>
  </NavBrand>
  <NavHamburger />
  <NavUl {activeUrl}>
    <NavLi
      activeClass="decoration-2 decoration-verdigris dark:decoration-verdigris"
      nonActiveClass="text-richBlack dark:text-linen hover:text-verdigris hover:text-shadow-glow dark:hover:text-shadow-glow"
      href="/">
      home
    </NavLi>
    <NavLi
      activeClass="decoration-2 decoration-verdigris dark:decoration-verdigris"
      nonActiveClass="text-richBlack dark:text-linen hover:text-verdigris hover:text-shadow-glow dark:hover:text-shadow-glow"
      href="/blog">
      blog
    </NavLi>
  </NavUl>
</Navbar>

<slot />

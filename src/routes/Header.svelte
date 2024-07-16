<script>
  import { page } from '$app/stores'
</script>

<header class="bg-white shadow-sm">
  <nav class="container mx-auto px-4 py-4">
    <ul class="flex space-x-6">
      <li>
        <a
          href="/"
          class="text-lg font-medium hover:text-blue-600 transition-colors duration-300"
          aria-current={$page.url.pathname === '/' ? 'page' : undefined}
        >
          Home
        </a>
      </li>
      <li>
        <a
          href="/about"
          class="text-lg font-medium hover:text-blue-600 transition-colors duration-300"
          aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
        >
          About
        </a>
      </li>
    </ul>
  </nav>
</header>

<script>
  import Header from './Header.svelte'
  import '../app.css'
  import { PUBLIC_CONVEX_URL } from '$env/static/public'
  import { setupConvex } from 'convex-svelte'
  import DebugView from '$components/DebugView.svelte'

  setupConvex(PUBLIC_CONVEX_URL)
</script>

<div class="flex flex-col min-h-screen">
  <Header />

  <main class="flex-1 flex flex-col p-4 w-full max-w-4xl mx-auto">
    <slot />
  </main>

  <DebugView />
  <footer
    class="bg-purple-200 dark:bg-purple-800 flex flex-col justify-center items-center p-3 sm:p-3"
  >
    <p class="text-white">
      <span class="font-bold">visit</span>
      <span class="text-blue-600 dark:text-blue-400 font-bold">ABC</span>
    </p>
  </footer>
</div>

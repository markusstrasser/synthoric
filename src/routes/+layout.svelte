<script>
  import Header from './Header.svelte'
  import '../app.css'
  import { PUBLIC_CONVEX_URL } from '$env/static/public'
  import { setupConvex } from 'convex-svelte'
  import DebugView from '$components/DebugView.svelte'
  import DebugSidebar from '$components/DebugSidebar.svelte'

  setupConvex(PUBLIC_CONVEX_URL)
</script>

<div class="flex flex-col min-h-screen gradient-bg">
  <Header />

  <main class="flex-1 flex flex-col p-8 w-full max-w-4xl mx-auto">
    <slot />
  </main>

  <DebugSidebar />
  <footer class="bg-gray-100 text-gray-600 py-4 text-center">
    <p class="text-sm">
      <span class="font-medium">visit</span>
      <span class="text-blue-600 font-bold hover:underline">ABC</span>
    </p>
  </footer>
</div>

<script>
  import Header from './Header.svelte'
  import '../app.css'
  import { PUBLIC_CONVEX_URL } from '$env/static/public'
  import { setupConvex } from 'convex-svelte'
  import DebugView from '$components/DebugView.svelte'
  import DebugSidebar from '$components/DebugSidebar.svelte'
  setupConvex(PUBLIC_CONVEX_URL)
</script>

<div class="gradient-bg flex min-h-screen flex-col">
  <Header></Header>

  <main class="mx-auto flex w-full max-w-4xl flex-1 flex-col p-8">
    <slot></slot>
  </main>

  <DebugSidebar></DebugSidebar>
  <footer class="bg-gray-100 py-4 text-center text-gray-600">
    <span class="font-bold text-blue-600 hover:underline">Footer</span>
  </footer>
</div>

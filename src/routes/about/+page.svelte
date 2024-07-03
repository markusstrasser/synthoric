<script>
  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>About</title>
  <meta name="description" content="About this app" />
</svelte:head>
<div class="text-column">
  <h1>About this app</h1>

  <p>Current path: {$page.url.pathname}</p>
  <p>Query parameters: {JSON.stringify($page.url.searchParams)}</p>
  <p>Route parameters: {JSON.stringify($page.params)}</p>
</div>

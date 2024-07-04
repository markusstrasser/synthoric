<script lang="ts">
  import type { PageData } from './$types'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { api } from '$convex/_generated/api.js'
  import { goto } from '$app/navigation'

  // const client = useConvexClient()
  // const query = useQuery(api.sequences.getLatestK, { k: 3 })
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Synth" />
</svelte:head>

<h1>Home</h1>

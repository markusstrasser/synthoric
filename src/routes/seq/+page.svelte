<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import Interaction from './Interaction.svelte'
  let interactions = []
  onMount(async () => {
    const res = await fetch('/api/interactions')
    interactions = (await res.json()).data
    console.log('interactions', interactions)
  })
</script>

{#each interactions as { tagline, content }}
  <Interaction data={{ tagline, content }} />
{/each}
<a href="/seq/1">Go to first sequence</a>

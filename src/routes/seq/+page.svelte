<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'

  let interactions: any
  onMount(async () => {
    const res = await fetch('/api/interactions')
    interactions = await res.json()
    console.log('interactions', interactions)
  })
</script>
<!-- 
{#each interactions as interaction}
  <div>
    {interaction.tagline}
  </div>
  <div>
    {#each interaction.content as item}
      <div>
        {item.question}
      </div>
    {/each}
  </div>
  <!-- {JSON.stringify(interaction)} -->
  <!-- Render interaction data -->
{/each} -->

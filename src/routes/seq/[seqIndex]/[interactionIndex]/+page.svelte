<script>
  import { useQuery } from 'convex-svelte'
  import { api } from '$convex/_generated/api'
  import { page, navigating } from '$app/stores'
  import { fly, slide } from 'svelte/transition'

  const { data } = $props()

  let sequence = $derived(data.sequence)
  let interaction = $derived(data.interaction)

  const nextPageUrl = $derived(`/seq/${sequence.index}/${interaction.interactionIndex + 1}`)
  const previousPageUrl = $derived(`/seq/${sequence.index}/${interaction.interactionIndex - 1}`)
</script>

<div>
  <div in:fly={{ y: 20 }} out:slide>{JSON.stringify(data)}</div>
  <h1>SeqIndex</h1>
  <div>{sequence.index}</div>
  <h1>Interaction</h1>
  <div>Index: {interaction.interactionIndex}</div>
  <div>{JSON.stringify(interaction)}</div>
  <h1>todos</h1>

  <a href={nextPageUrl}>next</a>
  <a href={previousPageUrl}>previous</a>

  {#if $navigating}
    <div>navigating to {$navigating.to?.url}</div>
  {/if}
</div>

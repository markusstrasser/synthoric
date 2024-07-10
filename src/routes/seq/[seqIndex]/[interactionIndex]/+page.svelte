<script>
  import { useQuery } from 'convex-svelte'
  import { api } from '$convex/_generated/api'
  import { page, navigating } from '$app/stores'
  import { fly, slide } from 'svelte/transition'

  const { data } = $props()

  let sequence = $derived(data.sequence)
  let interaction = $derived(data.interaction)
  let lastExistingInteractionIndex = $derived(data.lastExistingInteractionIndex)

  const currentInteractionIndex = $derived(Number.parseInt($page.params.interactionIndex))
  const nextPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex + 1}`)
  const previousPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex - 1}`)
  const lastExistingInteractionUrl = $derived(
    `/seq/${sequence?.index}/${lastExistingInteractionIndex}`
  )

  $inspect(
    'sequence',
    sequence,
    'interaction',
    interaction,
    'lastExistingInteractionIndex',
    lastExistingInteractionIndex
  )
  const isFirstInteraction = $derived(currentInteractionIndex === 0)
  const isExistingInteraction = $derived(
    lastExistingInteractionIndex >= currentInteractionIndex && currentInteractionIndex > -1
  )

  const shouldGenerateNewInteraction = $derived(
    sequence && currentInteractionIndex === lastExistingInteractionIndex + 1
  )

  const shouldGoToLastExistingInteraction = $derived(
    sequence && currentInteractionIndex === lastExistingInteractionIndex + 2
  )

  $inspect('shouldGenerateNewInteraction', shouldGenerateNewInteraction)
  $inspect('shouldGoToLastExistingInteraction', shouldGoToLastExistingInteraction)
  $inspect('isValidSequence', !!sequence)
  $inspect('isExistingInteraction', isExistingInteraction)
  //Cases
  //-> {seqIndex} doesn't exist -> Go to /
  //-> {seqIndex} exists but {interactionIndex} doesn't -> Go to last existing interactionIndex
  //-> {seqIndex} exists and {interactionIndex} exists -> Show interaction
</script>

<div>
  <div>{JSON.stringify(data)}</div>
  {#if !sequence}
    <div>This sequence doesn't even exist yet</div>
    <a href="/">Go back home</a>
  {:else if shouldGoToLastExistingInteraction}
    <div>Interaction doesn't exist yet. Go back to last available one:</div>
    <a href={lastExistingInteractionUrl}>Go to Latest Seen Interaction</a>
  {:else}
    {#if isExistingInteraction}
      <div>Existing INteraction</div>
    {:else if shouldGenerateNewInteraction}
      <div>....generating new interaction</div>
    {:else}
      <div>If clauses not exhaustive ... you shouldn't even see this?!</div>
    {/if}
    {#if shouldGenerateNewInteraction || isExistingInteraction}
      <a href={nextPageUrl}>next</a>
      {#if !isFirstInteraction}
        <a href={previousPageUrl}>previous</a>
      {/if}
    {/if}
  {/if}

  {#if $navigating}
    <div>navigating to {$navigating.to?.url}</div>
  {/if}
</div>

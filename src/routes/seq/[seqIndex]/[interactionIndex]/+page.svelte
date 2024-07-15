<script lang="ts">
  import { api } from '$convex/_generated/api.js'
  import { useQuery } from 'convex-svelte'
  import type { derived } from 'svelte/store'

  const { data } = $props()
  const {
    sequence,
    interaction,

    interactionState,
    currentInteractionIndex,
    lastExistingInteractionIndex,
  } = $derived(data)

  // let interaction = $state(data)

  // const params = $derived({
  //   seqIndex: sequence?.index,
  //   interactionIndex: currentInteractionIndex,
  // })

  // //! not updating on newPage
  // const interaction = useQuery(api.interactions.getByIndices, {
  //   seqIndex: data.sequence.index,
  //   interactionIndex: data.currentInteractionIndex,
  // })

  let generatedInteraction = $state(null)
  const interactionContent = $derived(generatedInteraction || interaction?.content)
  const statusQ = useQuery(api.cache.getStatus, {})
  let isGenerating = $state(false)
  const shouldGenerate = $derived(interactionState.type === 'NEW_INTERACTION' && !isGenerating)

  // export async function getInteraction() {
  //   if (shouldGenerate) {
  //     return await new Promise(f => setTimeout(f, 2000))
  //   }
  // }
  const nextPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex + 1}`)
  const previousPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex - 1}`)
  const isFirstInteraction = $derived(currentInteractionIndex === 0)

  $effect(() => {
    if (shouldGenerate) {
      isGenerating = true
      fetch('/api/generateNextInteraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sequenceIndex: sequence?.index,
          interactionIndex: currentInteractionIndex,
        }),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response data here if needed

          console.log('Generation complete:', data)

          generatedInteraction = data.data?.interaction
        })
        .catch(error => {
          console.error('Error generating next interaction:', error)
        })
    }
  })
</script>

<div>
  <h2>State: {interactionState.type}</h2>
  <h2>Status: {statusQ?.data?.status}</h2>
  {#if interactionState.type === 'OK'}
    <div>
      <h3>Interaction {currentInteractionIndex}</h3>
      <p>{JSON.stringify(interactionContent)}</p>
    </div>
  {:else if interactionState.type === 'NEW_INTERACTION'}
    <div>
      {#if interactionContent}
        <p>{JSON.stringify(interactionContent)}</p>
      {:else}
        <h3>Generating new interaction...</h3>
      {/if}
    </div>
  {:else if interactionState.type === 'SEQUENCE_NOT_FOUND'}
    <div>
      <a href="/">Go back home</a>
    </div>
  {:else if interactionState.type === 'INTERACTION_OUT_OF_BOUNDS'}
    <div>
      <a href="/seq/{sequence?.index}/{Math.max(lastExistingInteractionIndex, 0)}">
        Go to latest interaction
      </a>
    </div>
  {:else if interactionState.type === 'INTERACTION_NOT_FOUND'}
    <div>
      <a href="/">Go back home</a>
    </div>
  {/if}
  {#if interactionContent}
    <a href={nextPageUrl}>Next</a>
  {/if}
  {#if !isFirstInteraction}
    <a href={previousPageUrl}>Previous</a>
  {/if}
</div>

<script lang="ts">
  import Interaction from '$components/Interaction.svelte'
  import { api } from '$convex/_generated/api.js'
  import { useQuery } from 'convex-svelte'
  import DebugView from '$components/DebugView.svelte'
  import { setDebugInfo } from '$stores/index.svelte.js'

  const { data } = $props()
  const {
    sequence,
    interaction,

    interactionState,
    currentInteractionIndex,
    lastExistingInteractionIndex,
  } = $derived(data)

  let generatedInteraction = $state(null)
  const interactionContent = $derived(generatedInteraction || interaction?.content)
  const statusQ = useQuery(api.cache.getStatus, {})
  let isGenerating = $state(false)
  const shouldGenerate = $derived(interactionState.type === 'NEW_INTERACTION' && !isGenerating)

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

  $inspect(interactionContent, 'interactionContent')

  const debugInfo = $derived({
    state: interactionState.type,
    status: statusQ?.data?.status,
    index: currentInteractionIndex,
    isGenerating,
    shouldGenerate,
    isFirstInteraction,
  })

  $effect(() => {
    setDebugInfo(debugInfo)
  })
</script>

{#if interactionState.type === 'OK'}
  <div>
    <Interaction interactionConfig={interactionContent} />
  </div>
{:else if interactionState.type === 'NEW_INTERACTION'}
  <div>
    {#if interactionContent}
      <Interaction interactionConfig={interactionContent} />
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

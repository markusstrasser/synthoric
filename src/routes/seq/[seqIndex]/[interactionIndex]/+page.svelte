<script lang="ts">
  import Interaction from '$components/Interaction.svelte'
  import { api } from '$convex/_generated/api.js'
  import { useQuery } from 'convex-svelte'
  import { setDebugInfo } from '$stores/index.svelte.js'
  import { Button } from '$components/ui/button'
  import { Skeleton } from '$components/ui/skeleton'

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

<div class="mx-auto max-w-3xl px-4 py-8 font-serif">
  {#if interactionState.type === 'OK'}
    <div class="prose prose-lg">
      <Interaction interactionConfig={interactionContent} />
    </div>
  {:else if interactionState.type === 'NEW_INTERACTION'}
    <div class="space-y-4">
      {#if interactionContent}
        <Interaction interactionConfig={interactionContent} />
      {:else}
        <h3 class="text-2xl font-semibold">Generating new interaction...</h3>
        <Skeleton class="h-32 w-full" />
      {/if}
    </div>
  {:else if interactionState.type === 'SEQUENCE_NOT_FOUND'}
    <div class="py-12 text-center">
      <h2 class="mb-4 text-3xl font-bold">Sequence Not Found</h2>
      <Button variant="outline">
        <a href="/">Go back home</a>
      </Button>
    </div>
  {:else if interactionState.type === 'INTERACTION_OUT_OF_BOUNDS'}
    <div class="py-12 text-center">
      <h2 class="mb-4 text-3xl font-bold">Interaction Out of Bounds</h2>
      <Button variant="outline">
        <a href="/seq/{sequence?.index}/{Math.max(lastExistingInteractionIndex, 0)}">
          Go to latest interaction
        </a>
      </Button>
    </div>
  {:else if interactionState.type === 'INTERACTION_NOT_FOUND'}
    <div class="py-12 text-center">
      <h2 class="mb-4 text-3xl font-bold">Interaction Not Found</h2>
      <Button variant="outline">
        <a href="/">Go back home</a>
      </Button>
    </div>
  {/if}

  <div class="mt-8 flex justify-between">
    {#if !isFirstInteraction}
      <Button variant="outline">
        <a href={previousPageUrl}>← Previous</a>
      </Button>
    {:else}
      <div></div>
    {/if}

    {#if interactionContent}
      <Button variant="outline" disabled={isGenerating}>
        <a href={nextPageUrl}>Next →</a>
      </Button>
    {/if}
  </div>
</div>

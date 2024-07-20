<script lang="ts">
  import Interaction from '$components/Interaction.svelte'
  import { api } from '$convex/_generated/api.js'
  import { useQuery } from 'convex-svelte'
  import { setDebugInfo } from '$stores/index.svelte.js'
  import { Button } from '$components/ui/button'
  import { Skeleton } from '$components/ui/skeleton'
  import actionState from '$lib/stores/index.svelte'
  import { onMount } from 'svelte'
  const { data } = $props()
  const {
    sequence,
    interactionId,
    interactionState,
    currentInteractionIndex,
    lastExistingInteractionIndex,
  } = $derived(data)

  let interaction = $state()

  $effect(() => {
    //TODO: have the query just fetch the entire sequence + interactions ... no need for effects since the query has all seq data reactively
    //TODO: this would also solve the caching issues
    interaction = useQuery(api.interactions.getByIndices, {
      seqIndex: sequence?.index,
      interactionIndex: currentInteractionIndex,
    })
  })

  $effect(() => {
    if (interaction?.data?.userActions?.length > 0) {
      console.log('setting userActions from DB')
      actionState.userActions = interaction.data.userActions
      actionState.newSubmit = false
    } else {
      actionState.reset()
    }
  })

  $effect(() => {
    //different from hasSubmitted bc
    if (actionState.newSubmit) {
      console.log('patching userActions!!')
      fetch('/api/addUserActions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userActions: actionState.filteredUserActions, interactionId }),
      }).then(r => {
        actionState.newSubmit = false
      })
    }
  })

  $inspect(interaction, 'interact')
  const choices = $derived(interaction?.data?.content?.choices)
  $inspect(choices, 'choices')
  let generatedInteraction = $state(null)
  let generateState = $state(0)

  const interactionContent = $derived(interaction?.data?.content || generatedInteraction)
  const statusQ = useQuery(api.cache.getStatus, {})

  const shouldGenerate = $derived(
    interactionState.type === 'NEW_INTERACTION' && generateState === 0
  )

  const nextPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex + 1}`)
  const previousPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex - 1}`)
  const isFirstInteraction = $derived(currentInteractionIndex === 0)

  $effect(() => {
    if (shouldGenerate) {
      generateState = 1
      fetch('/api/generateNextInteraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sequenceIndex: sequence?.index,
          // interactionIndex: currentInteractionIndex,
        }),
      })
        .then(response => response.json())
        .then(nextInteraction => {
          // Handle the response data here if needed

          console.log('Generation complete:', nextInteraction)

          generatedInteraction = nextInteraction
          generateState = 2
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
    generateState,
    newSubmit: actionState.newSubmit,
    shouldGenerate,
    isFirstInteraction,
  })

  $effect(() => {
    setDebugInfo(debugInfo)
  })
</script>

{#if interaction?.data}
  <div class="mx-auto max-w-3xl px-4 py-8 font-serif">
    <h1>interact: {JSON.stringify(interaction.data.content)}</h1>
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
          <h4>Status: {statusQ?.data?.status}</h4>
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
        <Button variant="outline" disabled={generateState === 1}>
          <a href={nextPageUrl}>Next →</a>
        </Button>
      {/if}
    </div>
  </div>
{/if}

<script lang="ts">
  import Interaction from '$components/Interaction.svelte'
  import { api } from '$convex/_generated/api.js'
  import { setDebugInfo } from '$stores/index.svelte.js'
  import { Button } from '$components/ui/button'
  import { Skeleton } from '$components/ui/skeleton'
  import actionState from '$lib/stores/index.svelte'
  import { page } from '$app/stores'
  import { useConvexClient, useQuery } from 'convex-svelte'

  const convexClient = useConvexClient()
  const seqIndex = $derived(Number($page.params.seqIndex))
  const interactionIndex = $derived(Number($page.params.interactionIndex))

  let q = $state<
    { data?: { sequence?: any; interactionsInSeq?: any[] } | null; isLoading?: boolean } | undefined
  >()

  const statusQ = useQuery(api.cache.getStatus, {})
  const sequence = $derived(q?.data?.sequence)
  const interaction = $derived(q?.data?.interactionsInSeq?.[interactionIndex] ?? null)
  const interactionId = $derived(interaction?._id)
  const interactionContent = $derived(interaction?.content)
  const interactionCount = $derived(sequence?.interactions?.length ?? 0)
  const lastExistingInteractionIndex = $derived(interactionCount - 1)
  const isFirstInteraction = $derived(interactionIndex === 0)

  const nextPageUrl = $derived(`/seq/${sequence?.index}/${interactionIndex + 1}`)
  const previousPageUrl = $derived(`/seq/${sequence?.index}/${interactionIndex - 1}`)

  let generateState = $state(0)

  $effect.pre(() => {
    //? ask in the convex discord how to do dynamic page args better
    q = useQuery(api.sequences.getWithFullInteractions, { index: seqIndex })
  })

  $effect(() => {
    if (!interactionId) {
      return
    }
    convexClient.mutation(api.interactions.updateLastSeen, { interactionId })
  })

  $effect(() => {
    if (actionState.newSubmit) {
      console.log('patching userActions!!')
      convexClient
        .mutation(api.interactions.updateUserActions, {
          userActions: actionState.filteredUserActions,
          interactionId,
        })
        .then(r => {
          actionState.newSubmit = false
        })

      //TODO: add systemFeedback
    }
  })
  $effect(() => {
    const pastUserActions = interaction?.userActions ?? null
    actionState.syncUserActions(pastUserActions)
  })

  const interactionState = $derived.by(() => {
    if (q?.isLoading) return { type: 'LOADING' }
    if (!sequence) return { type: 'SEQUENCE_NOT_FOUND' }
    if (interactionIndex > lastExistingInteractionIndex + 1) {
      return { type: 'INTERACTION_OUT_OF_BOUNDS', lastAvailable: lastExistingInteractionIndex }
    }
    if (interactionIndex === lastExistingInteractionIndex + 1) return { type: 'NEW_INTERACTION' }
    if (!interaction) return { type: 'INTERACTION_NOT_FOUND' }
    return { type: 'OK' }
  })

  $inspect(interactionState, interaction, 'interactionState')
  const shouldGenerate = $derived(
    interactionState.type === 'NEW_INTERACTION' && generateState === 0
  )

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
        }),
      })
        .then(_ => {
          generateState = 2
        })
        .catch(error => {
          console.error('Error generating next interaction:', error)
        })
    }
  })

  $effect(() => {
    setDebugInfo({
      state: interactionState.type,
      status: statusQ?.data?.status,
      index: interactionIndex,
      generateState,
      newSubmit: actionState.newSubmit,
      shouldGenerate,
      isFirstInteraction,
    })
  })
</script>

{#if interaction}
  <div class="mx-auto max-w-3xl px-4 py-8 font-serif">
    <!-- <h1>interact: {JSON.stringify(interaction.content)}</h1> -->
    {#if interactionState.type === 'OK'}
      <div class="prose prose-lg">
        <Interaction interactionConfig={interactionContent} />
      </div>
    {/if}
  </div>
{/if}
{#if q && q.isLoading}
  <div class="py-12 text-center">
    <h2 class="mb-4 text-3xl font-bold">Loading...</h2>
    <Skeleton class="h-32 w-full" />
  </div>
{/if}
{#if q?.data}
  {#if interactionState.type === 'NEW_INTERACTION'}
    <div class="space-y-4">
      <h3 class="text-2xl font-semibold">Generating new interaction...</h3>
      <h4>Status: {statusQ?.data?.status}</h4>
      <Skeleton class="h-32 w-full" />
    </div>
  {/if}
  {#if interactionState.type === 'SEQUENCE_NOT_FOUND'}
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
    {#if !q?.isLoading}
      <div class="py-12 text-center">
        <h2 class="mb-4 text-3xl font-bold">Interaction Not Found</h2>
        <Button variant="outline">
          <a href="/">Go back home</a>
        </Button>
      </div>
    {/if}
  {/if}
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
    <Button variant="outline" disabled={generateState === 1 || !actionState.hasSubmitted}>
      <a href={nextPageUrl}>Next →</a>
    </Button>
  {/if}
</div>

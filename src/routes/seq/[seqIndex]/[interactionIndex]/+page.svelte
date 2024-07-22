<script lang="ts">
  import Interaction from '$components/Interaction.svelte'
  import { setDebugInfo } from '$stores/index.svelte.js'
  import { Button } from '$components/ui/button'
  import { Skeleton } from '$components/ui/skeleton'

  let { data } = $props()
  let { sequence, interactionState, currentInteractionIndex, interaction } = $derived(data)

  let generateState = $state(0)
  const shouldGenerate = $derived(
    interactionState.type === 'NEW_INTERACTION' && generateState === 0
  )

  const nextPageUrl = $derived(`/seq/${sequence.index}/${currentInteractionIndex + 1}`)
  const previousPageUrl = $derived(`/seq/${sequence.index}/${currentInteractionIndex - 1}`)
  const isFirstInteraction = $derived(currentInteractionIndex === 0)

  const debugInfo = $derived({
    state: interactionState.type,
    index: currentInteractionIndex,
    generateState,
    shouldGenerate,
    isFirstInteraction,
  })

  $effect(() => {
    setDebugInfo(debugInfo)
  })
</script>

<div class="mx-auto max-w-3xl px-4 py-8 font-serif">
  {#if interaction?.state === 'completed'}
    <div class="prose prose-lg">
      <Interaction interactionConfig={interaction.content} />
    </div>
  {/if}

  {#if interaction?.state === 'started'}
    <div class="space-y-4">
      {#if interaction.content}
        <Interaction interactionConfig={interaction.content} />
      {:else}
        <h3 class="text-2xl font-semibold">Generating new interaction...</h3>
        <Skeleton class="h-32 w-full" />
      {/if}
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

    {#if interaction?.content}
      <Button variant="outline" disabled={generateState === 1}>
        <a href={nextPageUrl}>Next →</a>
      </Button>
    {/if}
  </div>
</div>

<script lang="ts">
  const { data } = $props()
  const {
    sequence,
    interaction,
    interactionState,
    currentInteractionIndex,
    lastExistingInteractionIndex,
  } = $derived(data)

  const nextPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex + 1}`)
  const previousPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex - 1}`)
  const isFirstInteraction = $derived(currentInteractionIndex === 0)
</script>

<div>
  <h2>State: {interactionState.type}</h2>

  {#if interactionState.type === 'OK'}
    <div>
      <h3>Interaction {currentInteractionIndex}</h3>
      <p>{JSON.stringify(interaction)}</p>
      <div>
        <a href={nextPageUrl}>Next</a>
        {#if !isFirstInteraction}
          <a href={previousPageUrl}>Previous</a>
        {/if}
      </div>
    </div>
  {:else if interactionState.type === 'NEW_INTERACTION'}
    <div>
      <h3>Generating new interaction...</h3>
      <!-- Add logic here to generate new interaction -->
      {#if !isFirstInteraction}
        <a href={previousPageUrl}>Previous</a>
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
</div>

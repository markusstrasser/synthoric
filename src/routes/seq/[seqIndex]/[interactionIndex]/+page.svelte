<script lang="ts">
  let {
    sequence,
    interaction,
    interactionState,
    currentInteractionIndex,
    lastExistingInteractionIndex,
  } = $props()

  console.log(sequence, 'sequence')

  console.log(interactionState, 'interactionstate')

  const nextPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex + 1}`)
  const previousPageUrl = $derived(`/seq/${sequence?.index}/${currentInteractionIndex - 1}`)
  const isFirstInteraction = $derived(currentInteractionIndex === 0)

  function getStateMessage(state: typeof interactionState) {
    switch (state.type) {
      case 'OK':
        return 'Everything is fine.'
      case 'SEQUENCE_NOT_FOUND':
        return 'This sequence does not exist.'
      case 'INTERACTION_OUT_OF_BOUNDS':
        return `Interaction index too high. Last available: ${state.lastAvailable}`
      case 'NEW_INTERACTION':
        return 'This is a new interaction that needs to be generated.'
      case 'INTERACTION_NOT_FOUND':
        return 'This interaction does not exist, but it should.'
    }
  }

  $effect(() => {
    console.log('interactionState', interactionState)
    if (interactionState.type === 'NEW_INTERACTION') {
      console.log('Generating new interaction...')
    }
  })
</script>

<div>
  <h2>State: {interactionState.type}</h2>
  <p>{getStateMessage(interactionState)}</p>

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
      <p>This sequence doesn't exist.</p>
      <a href="/">Go back home</a>
    </div>
  {:else if interactionState.type === 'INTERACTION_OUT_OF_BOUNDS'}
    <div>
      <p>This interaction is out of bounds.</p>
      <a href="/seq/{sequence?.index}/{Math.max(lastExistingInteractionIndex, 0)}"
        >Go to latest interaction</a
      >
    </div>
  {:else if interactionState.type === 'INTERACTION_NOT_FOUND'}
    <div>
      <p>Wrong route buddy.</p>
      <a href="/">Go back home</a>
    </div>
  {/if}
</div>

<script lang="ts">
  import { mockInteraction } from '$lib/mocks'
  import { getInteractionContent } from '$lib/componentMap'
  import actions from '$stores/index.svelte'

  const { interactionConfig } = $props()

  console.log(actions.hasSubmitted, 'hasSubmitted')
  const interactionContent = $derived(
    getInteractionContent(interactionConfig, actions.hasSubmitted)
  )

  console.log(interactionConfig, 'content')
</script>

{#each interactionContent as { key, value, config }}
  <div>
    <svelte:component this={config.component} {...config.mapProps(value)} />
    {#each config.inputComponents || [] as InputComponent}
      <InputComponent {...config.mapProps(value)} />
    {/each}
  </div>
{/each}

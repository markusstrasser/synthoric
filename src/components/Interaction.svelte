<script lang="ts">
  import { mockInteraction } from '$lib/mocks'
  import { getInteractionContent } from '$lib/componentMap'
  import store from '$stores'

  const { interactionConfig } = $props()
  const interactionContent = $derived(getInteractionContent(interactionConfig, $store))

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

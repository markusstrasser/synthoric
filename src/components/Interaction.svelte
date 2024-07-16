<script lang="ts">
  import { getInteractionContent } from '$lib/componentMap'
  import actions from '$stores/index.svelte'

  const { interactionConfig } = $props()

  console.log(actions.hasSubmitted, 'hasSubmitted')
  $inspect(interactionConfig, 'interactionConfig')
  const interactionContent = $derived(
    getInteractionContent(interactionConfig, actions.hasSubmitted)
  )

  $inspect(interactionContent, 'interactionContent')

  // console.log(interactionContent, 'interactionContent')
</script>

{#each interactionContent as { component, props }}
  {#if component && props}
    <div>
      <svelte:component this={component} {...props} />
    </div>
  {/if}
{/each}

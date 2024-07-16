<script lang="ts">
  import componentMap from '$lib/componentMap'
  import actions from '$stores/index.svelte'

  const { interactionConfig: config } = $props()

  const interactionContent = $derived(
    Object.entries(config)
      .filter(([key, value]) => {
        const configItem = componentMap[key]
        return configItem && (!configItem.condition || configItem.condition(actions.hasSubmitted))
      })
      .map(([key, value]) => ({
        component: componentMap[key].component,
        props: componentMap[key].propMap(value, config),
      }))
  )
</script>

{#each interactionContent as { component, props }}
  <svelte:component this={component} {...props} />
{/each}

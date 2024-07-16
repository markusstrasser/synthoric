<script lang="ts">
  import componentMap from '$lib/componentMap'
  import actions from '$stores/index.svelte'
  import TextInput from './TextInput.svelte'
  import SubmitButton from './SubmitButton.svelte'
  const { interactionConfig: config } = $props()

  const interactionContent = $derived(
    Object.entries(config)
      .filter(([key, value]) => {
        const configItem = componentMap[key]
        return configItem && (!configItem.condition || configItem.condition(actions.hasSubmitted))
      })
      .map(([key, value]) => ({
        name: key,
        component: componentMap[key].component,
        props: componentMap[key].propMap(value, config),
      }))
  )

  const hasChoices = $derived(interactionContent.some(item => item.name === 'choices'))
</script>

{#each interactionContent as { component, props }}
  <svelte:component this={component} {...props} />
{/each}

{#if !hasChoices}
  <TextInput />
{/if}
<SubmitButton />

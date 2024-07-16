<script lang="ts">
  import componentMap from '$lib/componentMap'
  import actions from '$stores/index.svelte'
  import TextInput from './TextInput.svelte'
  import SubmitButton from './SubmitButton.svelte'
  const { interactionConfig: config } = $props()

  const displayOrderByType = ['task', 'choices', 'hint', 'solution']
  const interactionContent = $derived(
    Object.entries(config)
      .filter(([key, _]) => {
        const configItem = componentMap[key]
        return configItem && (!configItem.condition || configItem.condition(actions.hasSubmitted))
      })
      .map(([key, value]) => ({
        name: key,
        component: componentMap[key].component,
        props: componentMap[key].propMap(value, config),
      }))
      .sort((a, b) => displayOrderByType.indexOf(a.name) - displayOrderByType.indexOf(b.name))
  )

  const hasChoices = $derived(interactionContent.some(item => item.name === 'choices'))
</script>

{#each interactionContent as { name, component, props }}
  <svelte:component this={component} {...props} />
  {#if name === 'choices'}
    <SubmitButton disabled={actions.hasSubmitted} />
  {/if}
  {#if name === 'task' && !hasChoices}
    <TextInput />
    <SubmitButton disabled={actions.hasSubmitted} />
  {/if}
{/each}

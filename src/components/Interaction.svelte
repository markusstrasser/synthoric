<script lang="ts">
  import componentMap from '$lib/componentMap'
  import actions from '$stores/index.svelte'
  import TextInput from './TextInput.svelte'
  import SubmitButton from './SubmitButton.svelte'
  import { fade } from 'svelte/transition'

  const { interactionConfig } = $props<{ interactionConfig: Record<string, any> }>()

  const displayOrderByType = ['task', 'choices', 'hint', 'solution']
  const interactionContent = $derived(
    Object.entries(interactionConfig)
      .filter(([key, _]) => {
        const configItem = componentMap[key]
        return configItem && (!configItem.condition || configItem.condition(actions.hasSubmitted))
      })
      .map(([key, value]) => ({
        name: key,
        component: componentMap[key].component,
        props: componentMap[key].propMap(value, interactionConfig),
      }))
      .sort((a, b) => displayOrderByType.indexOf(a.name) - displayOrderByType.indexOf(b.name))
  )

  const hasChoices = $derived(interactionContent.some(item => item.name === 'choices'))
</script>

<div class="space-y-8">
  {#each interactionContent as { name, component, props }, index}
    <div in:fade={{ delay: index * 100, duration: 300 }}>
      <svelte:component this={component} {...props} />
    </div>
    {#if name === 'choices'}
      <div class="mt-4">
        <SubmitButton disabled={actions.hasSubmitted} />
      </div>
    {/if}
    {#if name === 'task' && !hasChoices}
      <div class="space-y-4">
        <TextInput />
        <SubmitButton disabled={actions.hasSubmitted} />
      </div>
    {/if}
  {/each}
</div>

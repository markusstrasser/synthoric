<script lang="ts">
  import componentMap from '$lib/componentMap.svelte'
  import actions from '$stores/index.svelte'
  import TextInput from './TextInput.svelte'
  import SubmitButton from './SubmitButton.svelte'
  import { fade } from 'svelte/transition'

  const { interactionConfig } = $props<{ interactionConfig: Record<string, any> }>()

  const displayOrderByType = ['task', 'choices', 'hint', 'solution']
  const interactionContent = $derived(
    Object.entries(interactionConfig)
      .filter(([key, _]) => {
        console.log(key, 'key')
        return componentMap[key]
        // const configItem = componentMap[key]
        // return configItem && (!configItem.shouldHideP || configItem.shouldHideP(actions.hasSubmitted))
      })
      .map(([key, value]) => {
        const { component, propMap, shouldHideP } = componentMap[key]
        return {
          name: key,
          component,
          props: propMap?.(value, interactionConfig) || value,
          shouldHide: shouldHideP?.(actions.hasSubmitted),
        }
      })
      .sort((a, b) => displayOrderByType.indexOf(a.name) - displayOrderByType.indexOf(b.name))
  )

  const hasChoices = $derived(interactionContent.some(item => item.name === 'choices'))
</script>

<div class="space-y-8">
  {#each interactionContent as { name, component, props, shouldHide }, index}
    <div in:fade={{ delay: index * 100, duration: 300 }}>
      <!-- {#if !shouldHide} -->
      {$inspect(props, 'props')}
      <svelte:component this={component} {...props} />
      <!-- {/if} -->
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

<script lang="ts">
  import actions, { createDispatch } from '$stores/index.svelte'
  import TextInput from './TextInput.svelte'
  import SubmitButton from './SubmitButton.svelte'
  import { fade } from 'svelte/transition'
  import { Button } from './ui/button'
  import componentMapper from '$lib/componentMap.svelte'
  import type { UserAction } from '$lib/types'

  const { interactionConfig } = $props<{ interactionConfig: Record<string, unknown> }>()

  const displayOrderByType = ['task', 'choices', 'hint', 'solution']

  const componentMap = componentMapper(actions) as Record<string, unknown>
  const interactionContent = $derived(
    Object.entries(interactionConfig)
      .filter(([key, _]) => {
        console.log(key, 'key')
        return componentMap[key]
        // const configItem = componentMap[key]
        // return configItem && (!configItem.shouldHideP || configItem.shouldHideP(actions.hasSubmitted))
      })
      .map(([key, value]) => {
        const { component, propMap, shouldShow } = componentMap[key]

        return {
          name: key,
          component,
          props: propMap?.(value, interactionConfig) || value,
          shouldShow: shouldShow ?? true, //? if undefined. if false -> false
        }
      })
      .sort((a, b) => displayOrderByType.indexOf(a.name) - displayOrderByType.indexOf(b.name))
  )

  const hasChoices = $derived(interactionContent.some(item => item.name === 'choices'))
  type DispatchUserAction = (action: UserAction) => void
</script>

<div class="space-y-8">
  {$inspect(actions, 'actions')}
  {#each interactionContent as { name, component, props, shouldShow }, index}
    {@const dispatch = createDispatch()}
    <div in:fade={{ delay: index * 100, duration: 300 }}>
      {$inspect(shouldShow, 'shouldShow', name)}
      {#if shouldShow}
        <svelte:component this={component} {...props} {dispatch} />
      {:else}
        <Button on:click={() => (actions.revealedMultipleChoices = true)}>Choices</Button>
      {/if}
    </div>
    {#if name === 'choices'}
      <div class="mt-4">
        <SubmitButton disabled={actions.hasSubmitted} />
      </div>
    {/if}
    {#if (name === 'task' || name === 'text') && !hasChoices}
      <div class="space-y-4">
        <TextInput {dispatch} />
        <SubmitButton disabled={actions.hasSubmitted} />
      </div>
    {/if}
  {/each}
</div>

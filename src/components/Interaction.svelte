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

<div class="flex flex-col items-center p-4">
  <div class="w-full max-w-2xl space-y-4">
    {#each interactionContent as { name, component, props }}
      <div class="w-full">
        <svelte:component this={component} {...props} />
      </div>
      {#if name === 'choices'}
        <div class="w-full">
          <SubmitButton disabled={actions.hasSubmitted} />
        </div>
      {/if}
      {#if name === 'task' && !hasChoices}
        <div class="w-full">
          <TextInput />
        </div>
        <div class="w-full">
          <SubmitButton disabled={actions.hasSubmitted} />
        </div>
      {/if}
    {/each}
  </div>
</div>

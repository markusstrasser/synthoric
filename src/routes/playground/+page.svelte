<script lang="ts">
  import Markdown from 'svelte-markdown'
  import SolutionReview from './../../components/SolutionReview.svelte'
  import SubmitButton from '$components/SubmitButton.svelte'
  import TextInput from '$components/TextInput.svelte'
  import MultipleChoice from '$components/MultipleChoice.svelte'
  import { mockInteraction } from '$lib/mocks'
  import store from '$stores'

  $: hasSubmitted = $store.hasSubmitted

  // Remove the store subscription, as it's no longer needed with runes

  const componentMap = {
    task: {
      component: Markdown,
      mapProps: props => ({ source: props.content }),
      inputComponents: [TextInput, SubmitButton],
    },
    solution: {
      component: SolutionReview,
      mapProps: props => props,
      condition: store => store.hasSubmitted,
    },
    multipleChoiceTask: {
      component: MultipleChoice,
      mapProps: props => props,
      inputComponents: [MultipleChoice],
    },
    'text-input': {
      component: TextInput,
      mapProps: props => props,
    },
    'submit-button': {
      component: SubmitButton,
      mapProps: props => props,
    },
  }

  console.log(hasSubmitted, 'submitted')
  type ComponentKey = keyof typeof componentMap

  // Simplify the derived content using the $ rune
  $: exerciseContent = Object.entries(mockInteraction.content)
    .filter((entry): entry is [ComponentKey, any] => entry[0] in componentMap)
    .map(([key, value]) => ({ key, value, config: componentMap[key] }))
    .filter(({ config }) => !config.condition || config.condition($store))

  console.log(mockInteraction, 'content')
</script>

<!-- {@debug hasSubmitted} -->
{#each exerciseContent as { key, value, config }}
  <div>
    <svelte:component this={config.component} {...config.mapProps(value)} />
    {#each config.inputComponents || [] as InputComponent}
      <InputComponent {...config.mapProps(value)} />
    {/each}
  </div>
{/each}

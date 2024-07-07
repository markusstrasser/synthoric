<script lang="ts">
  import Markdown from 'svelte-markdown'
  import SolutionReview from './../../components/SolutionReview.svelte'
  import SubmitButton from '$components/SubmitButton.svelte'
  import TextInput from '$components/TextInput.svelte'
  import MultipleChoice from '$components/MultipleChoice.svelte'
  import { mockInteraction } from '$lib/mocks'
  import store from '$stores'

  let hasSubmitted = $derived($store.hasSubmitted)

  // Subscribe to the store
  store.subscribe($store => {
    console.log('hey', $store, hasSubmitted)
    // hasSubmitted = $store.hasSubmitted
  })

  const componentMap = {
    task: {
      component: Markdown,
      mapProps: props => ({ source: props.content }),
      inputComponents: [TextInput, SubmitButton],
    },
    solution: {
      component: SolutionReview,
      mapProps: props => props,
      condition: () => hasSubmitted,
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

  //! this derived runes are kinda hard to work with sometimes,
  let exerciseContent = $derived(
    Object.entries(mockInteraction.content)
      .filter((entry): entry is [ComponentKey, any] => entry[0] in componentMap)
      .map(([key, value]) => ({ key, value, config: componentMap[key] }))
      .filter(({ config }) => !config.condition || config.condition())
  )

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

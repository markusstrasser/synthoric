<script lang="ts">
  import Markdown from 'svelte-markdown'
  import SolutionReview from './../../components/SolutionReview.svelte'
  import SubmitButton from '$components/SubmitButton.svelte'
  import TextInput from '$components/TextInput.svelte'
  import MultipleChoice from '$components/MultipleChoice.svelte'
  import { mockExercise } from '$lib/mocks'
  import store from '$stores'

  export const mapProps = (props: Record<string, any>, propMap?: Record<string, string>) => {
    if (!propMap) return props
    return Object.entries(props).reduce((acc, [key, value]) => {
      const mappedKey = propMap[key] || key
      acc[mappedKey] = value
      return acc
    }, {})
  }
  $: ({ hasSubmitted, userActions } = $store)

  const componentConfig = {
    task: { component: Markdown, propMap: { content: 'source' } },
    solution: { component: SolutionReview },
    multipleChoiceTask: { component: MultipleChoice },
    'text-input': { component: TextInput },
    'submit-button': { component: SubmitButton },
  } as const

  type ComponentKey = keyof typeof componentConfig

  const inputBindings = {
    task: ['text-input', 'submit-button'],
    multipleChoiceTask: ['multipleChoiceOptions'],
  }

  console.log(mockExercise, 'content')
</script>

{#each Object.entries(mockExercise.content) as [key, value]}
  {#if key in componentConfig}
    <div>
      <svelte:component
        this={componentConfig[key as ComponentKey].component}
        {...mapProps(value, componentConfig[key as ComponentKey].propMap)}
      />
      {#if key in inputBindings}
        {#each inputBindings[key] as input}
          <svelte:component
            this={componentConfig[input].component}
            {...mapProps(value, componentConfig[input].propMap)}
          />
        {/each}
      {/if}
    </div>
  {/if}
{/each}

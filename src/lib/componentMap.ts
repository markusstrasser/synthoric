import Markdown from 'svelte-markdown'
import SolutionReview from '$components/SolutionReview.svelte'
import SubmitButton from '$components/SubmitButton.svelte'
import TextInput from '$components/TextInput.svelte'
import MultipleChoice from '$components/MultipleChoice.svelte'

type ComponentKey = keyof typeof componentMap
type ComponentConfig<T = any> = {
  component: ComponentType
  mapProps: (value: T) => any
  condition?: (hasSubmitted: boolean) => boolean
  inputComponents?: ComponentType[]
}
const componentMap: Record<string, ComponentConfig> = {
  task: {
    component: Markdown,
    mapProps: props => ({ source: props.content }),
    inputComponents: [TextInput, SubmitButton],
  },
  solution: {
    component: SolutionReview,
    mapProps: props => props,
    condition: hasSubmitted => hasSubmitted,
  },
  multipleChoiceTask: {
    component: MultipleChoice,
    mapProps: props => props,
    inputComponents: [MultipleChoice],
  },
  systemFeedback: {
    component: Markdown,
    mapProps: props => ({ source: props }),
    condition: hasSubmitted => hasSubmitted,
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
export default componentMap

export const getInteractionContent = (interaction: any, hasSubmitted: boolean) => {
  return Object.entries(interaction.content)
    .filter(([key]) => key in componentMap)
    .map(([key, value]) => ({ key, value, config: componentMap[key] }))
    .filter(({ config }) => !config.condition || config.condition(hasSubmitted))
}

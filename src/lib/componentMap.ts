import Markdown from 'svelte-markdown'
import SolutionReview from '$components/SolutionReview.svelte'
import MultipleChoice from '$components/MultipleChoice.svelte'

type ComponentConfig<T = any> = {
  component: any
  mapProps?: (value: T, interaction: any) => any
  condition?: (hasSubmitted: boolean) => boolean
}

const componentMap: Record<string, ComponentConfig> = {
  task: {
    component: Markdown,
    mapProps: props => ({ source: props }),
  },
  solution: {
    component: SolutionReview,
    condition: hasSubmitted => hasSubmitted,
  },
  choices: {
    component: MultipleChoice,
    mapProps: (props, interaction) => ({
      choices: props,
      isCorrect: interaction?.isCorrect,
    }),
  },
  systemFeedback: {
    component: Markdown,
    mapProps: props => ({ source: props }),
    condition: hasSubmitted => hasSubmitted,
  },
}

export const getInteractionContent = (interaction: any, hasSubmitted: boolean) => {
  return Object.keys(interaction)
    .filter(key => key in componentMap)
    .map(key => {
      const config = componentMap[key as keyof typeof componentMap]
      const value = interaction[key]
      return {
        key,
        component: config.component,
        props: config.mapProps ? config.mapProps(value, interaction) : value,
      }
    })
    .filter(({ component, props }) => component && props)
    .filter(
      ({ key }) => !componentMap[key]?.condition || componentMap[key].condition?.(hasSubmitted)
    )
}

export default componentMap

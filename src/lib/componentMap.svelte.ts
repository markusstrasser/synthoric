import Markdown from '$components/Markdown.svelte'
import MultipleChoice from '$components/MultipleChoice.svelte'
import SolutionReview from '$components/SolutionReview.svelte'

const identity = i => i
interface ComponentMapItem {
  component: any
  propMap?: (props: any, interaction?: any) => any
  shouldHideP?: (state: any) => boolean
}

const componentMap: { [key: string]: ComponentMapItem } = {
  // ... existing component map entries
  task: {
    component: Markdown,
    propMap: text => ({ text }),
  },
  choices: {
    component: MultipleChoice,
    propMap: (props, interaction) => ({
      choices: props,
      isCorrect: interaction?.isCorrect,
    }),
    shouldHideP: shouldHide => true,
  },
  systemFeedback: {
    component: Markdown,
    shouldHideP: hasSubmitted => hasSubmitted,
    propMap: identity,
  },
  solution: {
    component: SolutionReview,
    shouldHideP: hasSubmitted => hasSubmitted,
    propMap: identity,
  },
}

export default componentMap

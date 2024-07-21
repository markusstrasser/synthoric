import Markdown from 'svelte-markdown'
import MultipleChoice from '$components/MultipleChoice.svelte'
import SolutionReview from '$components/SolutionReview.svelte'

const identity = i => i
interface ComponentMapItem {
  component: any
  propMap: (props: any, interaction?: any) => any
  condition?: (revealedMultipleChoice: any) => boolean
}

const componentMap: { [key: string]: ComponentMapItem } = {
  // ... existing component map entries
  task: {
    component: Markdown,
    propMap: props => ({ source: props }),
  },
  choices: {
    component: MultipleChoice,
    propMap: (props, interaction) => ({
      choices: props,
      isCorrect: interaction?.isCorrect,
    }),
    // condition: reaveledMultipleChoice => reaveledMultipleChoice,
  },
  systemFeedback: {
    component: Markdown,
    propMap: props => ({ source: props }),
    condition: hasSubmitted => hasSubmitted,
  },
  solution: {
    component: SolutionReview,
    condition: hasSubmitted => hasSubmitted,
    propMap: identity,
  },
}

export default componentMap

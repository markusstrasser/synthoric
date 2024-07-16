import Markdown from 'svelte-markdown'
import MultipleChoice from '$components/MultipleChoice.svelte'
import SolutionReview from '$components/SolutionReview.svelte'

const identity = i => i
export default {
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

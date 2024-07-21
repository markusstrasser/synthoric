import Markdown from '$components/Markdown.svelte'
import MultipleChoice from '$components/MultipleChoice.svelte'
import SolutionReview from '$components/SolutionReview.svelte'

const identity = i => i
interface ComponentMapItem {
  component: any
  propMap?: (props: any, interaction?: any) => any
  shouldShow?: boolean
}

const componentMapper = (actions): { [key: string]: unknown } => ({
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
    get shouldShow() {
      return actions.revealedMultipleChoices
    },
  },
  systemFeedback: {
    component: Markdown,
    get shouldShow() {
      return !actions.hasSubmitted
    },
    propMap: identity,
  },
  solution: {
    component: SolutionReview,
    get shouldShow() {
      return !actions.hasSubmitted
    },
    propMap: identity,
  },
})

export default componentMapper

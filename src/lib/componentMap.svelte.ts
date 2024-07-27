import Markdown from '$components/Markdown.svelte'
import MultipleChoice from '$components/MultipleChoice.svelte'
import SolutionReview from '$components/SolutionReview.svelte'
import SystemFeedback from '$components/SystemFeedback.svelte'
const identity = <T>(i: T): T => i

interface ComponentMapItem {
  component: any
  propMap?: (props: any, interaction?: any) => any
  shouldShow?: boolean | (() => boolean)
}

interface Actions {
  revealedMultipleChoices: boolean
  hasSubmitted: boolean
}

type ComponentMap = {
  [key: string]: ComponentMapItem
}

const componentMapper = (actions: Readonly<Actions>): ComponentMap => ({
  // ... existing component map entries
  task: {
    component: Markdown,
    propMap: (text: string) => ({ text }),
  },
  text: {
    component: Markdown,
    propMap: (text: string) => ({ text }),
  },
  choices: {
    component: MultipleChoice,
    propMap: (props: any, interaction?: { isCorrect?: boolean }) => ({
      choices: props,
      isCorrect: interaction?.isCorrect,
    }),
    get shouldShow() {
      return actions.revealedMultipleChoices || actions.hasSubmitted
    },
  },
  // systemFeedback: {
  //   component: SystemFeedback,
  //   get shouldShow() {
  //     return actions.hasSubmitted
  //   },
  //   propMap: identity,
  // },
  solution: {
    component: SolutionReview,
    get shouldShow() {
      return actions.hasSubmitted
    },
    propMap: identity,
  },
})

export default componentMapper

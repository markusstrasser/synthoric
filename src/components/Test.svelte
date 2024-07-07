<script lang="ts">
  import { onDestroy } from 'svelte'
  import TextInput from './TextInput.svelte'
  import Button from './SubmitButton.svelte'
  import store, { type UserAction } from '$lib/stores/index'
  import SolutionReview from './SolutionReview.svelte'

  const solutionData = {
    highLevelSketch: 'This is a high-level sketch of the solution...',
    conceptualExplanation: "Here's a conceptual explanation...",
    stepsNested: [
      {
        step: 'Step 1: Do this',
        subSteps: [{ title: 'Substep 1.1: Details...' }, { title: 'Substep 1.2: More details...' }],
      },
      // ... more steps
    ],
  }

  let userActions: UserAction[] = []

  const unsubscribe = store.subscribe(({ userActions: actions }) => {
    userActions = actions
  })

  onDestroy(unsubscribe)
</script>

<div>
  <TextInput id="example-input" placeholder="Enter text here" />
  <Button id="submit-button" />
  <SolutionReview {...solutionData} />
</div>

<div>
  <h3>Current Actions:</h3>
  <pre>{JSON.stringify(userActions, null, 2)}</pre>
</div>

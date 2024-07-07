<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'
  import TextInput from './TextInput.svelte'
  import SolutionReview from './SolutionReview.svelte'
  import store from '$lib/stores'
  import type { UserAction } from '$stores'
  const { interaction, readOnly = false } = $props()

  const { task, solution, systemFeedback } = interaction

  let hasSubmitted = $state(false)
  let userActions: UserAction[] = $state([])

  store.subscribe(state => {
    hasSubmitted = state.hasSubmitted
    userActions = state.userActions
  })
</script>

<hr />

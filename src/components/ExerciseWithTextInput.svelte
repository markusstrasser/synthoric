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

<progress value={0.7} />
<SvelteMarkdown source={task} />
<TextInput id="1" {readOnly} />
<slot></slot>

{#if systemFeedback?.length > 0}
  <h3>YOUR SUBMISSION: {userActions[0]?.value}</h3>
  <div>{JSON.stringify(systemFeedback)}</div>
{/if}

{#if !hasSubmitted}
  <div>-.*submit to see solution.*.-</div>
{:else}
  <SolutionReview {...solution} />
{/if}

<hr />

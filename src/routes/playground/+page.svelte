<script lang="ts">
  import { ActionState } from '$stores/index.svelte.ts'
  // import { mockInteraction } from '$lib/mocks'
  // import Interaction from '$components/Interaction.svelte'
  import actions from '$stores/index.svelte'
</script>

<button on:click={() => (actions.newSubmit = true)}>Submit</button>
<div>
  {JSON.stringify(actions)}
</div>
<div>submitted: {actions.newSubmit}</div>
<!-- <Interaction interactionConfig={mockInteraction} /> -->

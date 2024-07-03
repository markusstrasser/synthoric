<script lang="ts">
  import { page } from '$app/stores'
  import { addUserAction } from '$lib/stores'
  import { api } from '$convex/_generated/api'
  import { useConvexClient } from 'convex-svelte'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  const client = useConvexClient()

  $: ({ seqIndex, interactionIndex } = $page.params)

  let sequence: any = null
  let lastValidIndex: number | null = null
  let showRedirectButton = false
  let redirectUrl = '/'

  onMount(async () => {
    sequence = await client.query(api.sequences.getByIndex, {
      index: Number.parseInt(seqIndex),
    })

    if (!sequence) {
      showRedirectButton = true
      return
    }

    lastValidIndex = sequence.interactions.findLastIndex(interaction => interaction != null)

    const currentIndex = Number.parseInt(interactionIndex)
    if (!lastValidIndex) {
      lastValidIndex = -1
    }
    if (currentIndex > lastValidIndex + 1 || currentIndex < 0) {
      showRedirectButton = true
      redirectUrl = lastValidIndex ?? -1 >= 0 ? `/seq/${seqIndex}/${lastValidIndex}` : '/'
    } else if (currentIndex === lastValidIndex + 1) {
      // Create new interaction
      await client.mutation(api.interactions.create, {
        seqIndex: Number.parseInt(seqIndex),
        // interactionIndex: currentIndex,
      })
    }
  })

  const handleRedirect = () => {
    goto(redirectUrl)
  }

  const pushFinal = (node: HTMLElement) => {
    const handleClick = () => {
      console.log('Submitting action')
      addUserAction({ value: 'hi' })
    }

    node.addEventListener('click', handleClick)

    return {
      destroy() {
        node.removeEventListener('click', handleClick)
      },
    }
  }
</script>

<h1>Interaction in the sequence</h1>

{#if showRedirectButton}
  <div>
    {#if sequence}
      <p>
        This interaction doesn't exist yet. The last valid interaction is at index {lastValidIndex}.
      </p>
    {:else}
      <p>This sequence doesn't exist.</p>
    {/if}
    <button on:click={handleRedirect}>
      {sequence ? 'Go to last valid interaction' : 'Go to homepage'}
    </button>
  </div>
{:else}
  <h3>All Parameters:</h3>
  <div>
    SeqIndex: {seqIndex}
    InteractionIndex: {interactionIndex}
  </div>

  <!-- If on first index : go back to /seq -->
  <!-- If on n index: go back to seq/n-1 -->
  <!-- -->

  <!-- const actions = {
    onclick,
    onSelectedText: text to store,
    onDrag,
  } -->

  <!-- <div use:captureUserActions("onSelectText", {value: "selectedText"})>TASK: DO A</div> -->
  <div>SOLUTION (**hidden** until review-flow is done)</div>
  <!-- <button onclick={submitAnswer}> SUBMIT ANSWER </button> -->
  <button use:pushFinal>Submit</button>
  <div>Review, Remediation (wait for AI to review Submission)</div>
  <a href="">Go back</a>
  <a href=""> Next (display on review-flow done) -: Upload to DB -: Run inference on db.history</a>
{/if}

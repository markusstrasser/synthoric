<script lang="ts">
  import { page } from '$app/stores'
  import { addUserAction } from '$lib/stores'
  import { api } from '$convex/_generated/api'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  const client = useConvexClient()

  const { seqIndex, interactionIndex } = $page.params

  let sequence: any = null
  let lastValidIndex: number | null = null
  let showRedirectButton = false
  let redirectUrl = '/'

  let interaction = $state([])
  // const interactionQuery = useQuery(api.interactions.getByIndices, {
  //   seqIndex: Number.parseInt(seqIndex),
  //   interactionIndex: Number.parseInt(interactionIndex),
  // })

  onMount(async () => {
    sequence = await client.query(api.sequences.getByIndex, {
      index: Number.parseInt(seqIndex),
    })

    interaction = await client.query(api.interactions.getByIndices, {
      seqIndex: Number.parseInt(seqIndex),
      interactionIndex: Number.parseInt(interactionIndex),
    })
    console.log('interaction', interaction)

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
        interactionIndex: Number.parseInt(interactionIndex),
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

  <h2>Interaction Details:</h2>
  <pre>{JSON.stringify(interaction, null, 2)}</pre>

  <div>SOLUTION (**hidden** until review-flow is done)</div>
  <button use:pushFinal>Submit</button>
  <div>Review, Remediation (wait for AI to review Submission)</div>
  <a href="">Go back</a>
  <a href=""> Next (display on review-flow done) -: Upload to DB -: Run inference on db.history</a>
{/if}

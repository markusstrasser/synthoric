<script lang="ts">
  import { page } from '$app/stores'
  import { addUserAction } from '$lib/stores'
  import { api } from '$convex/_generated/api'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { redirect } from '@sveltejs/kit'

  const client = useConvexClient()

  const { seqIndex, interactionIndex } = $page.params

  let sequence: any = $state([])
  let generateInteractionAtIndex: number | null = null
  let showRedirectButton = $state(false)
  let redirectUrl = '/'
  const interactionQuery = useQuery(api.interactions.getByIndices, {
    seqIndex: Number.parseInt(seqIndex),
    interactionIndex: Number.parseInt(interactionIndex),
  })

  onMount(async () => {
    sequence = await client.query(api.sequences.getByIndex, {
      index: Number.parseInt(seqIndex),
    })

    if (!sequence) {
      showRedirectButton = true
      return
    }

    const generateInteractionAtIndex = sequence.interactions.length || 0

    const currentIndex = Number.parseInt(interactionIndex)

    console.log('genat', generateInteractionAtIndex, 'currentindex', currentIndex)
    if (currentIndex > generateInteractionAtIndex || currentIndex < 0) {
      showRedirectButton = true
      redirectUrl = `/seq/${seqIndex}/${generateInteractionAtIndex}`
    } else if (currentIndex === generateInteractionAtIndex) {
      // Create new interaction
      console.log('CREATING NEW INTERACTION')
      await client.mutation(api.interactions.create, {
        seqIndex: Number.parseInt(seqIndex),
        interactionIndex: Number.parseInt(interactionIndex),
      })
    }
  })

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
        This interaction doesn't exist yet. The last valid interaction is at index {generateInteractionAtIndex}.
      </p>
    {:else}
      <p>This sequence doesn't exist.</p>
    {/if}
    <button
      onclick={() =>
        goto(redirectUrl, { replaceState: true }).then(() => {
          location.reload()
        })}
    >
      {sequence ? 'Go to last interaction in sequence' : 'Go to homepage'}
    </button>
  </div>
{:else}
  <h3>All Parameters:</h3>
  <div>
    SeqIndex: {seqIndex}
    InteractionIndex: {interactionIndex}
  </div>

  {#if interactionQuery.isLoading}
    <p>Loading interaction data...</p>
  {:else if interactionQuery.error}
    <p>Error loading interaction: {interactionQuery.error.toString()}</p>
  {:else if interactionQuery.data}
    <h2>Interaction Details:</h2>
    <pre>{JSON.stringify(interactionQuery.data, null, 2)}</pre>
  {:else}
    <p>No interaction data available.</p>
  {/if}

  <div>SOLUTION (**hidden** until review-flow is done)</div>
  <button use:pushFinal>Submit</button>
  <div>Review, Remediation (wait for AI to review Submission)</div>
  <a href="">Go back</a>
  <a href=""> Next (display on review-flow done) -: Upload to DB -: Run inference on db.history</a>
{/if}

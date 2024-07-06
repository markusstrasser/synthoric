<script lang="ts">
  import { page } from '$app/stores'
  import { api } from '$convex/_generated/api'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { goto } from '$app/navigation'

  const client = useConvexClient()

  const seqIndex = $state(Number.parseInt($page.params.seqIndex))
  const interactionIndex = $state(Number.parseInt($page.params.interactionIndex))

  //TODO: put this logic and routing into own class/file?
  const sequence = useQuery(api.sequences.getByIndex, { index: seqIndex })
  const interaction = useQuery(api.interactions.getByIndices, { seqIndex, interactionIndex })

  $effect(() => {
    if (!sequence.data) return

    const lastValidIndex = sequence.data.interactions.length
    if (interactionIndex > lastValidIndex || interactionIndex < 0) {
      goto(`/seq/${seqIndex}/${lastValidIndex}`, { replaceState: true })
    } else if (interactionIndex === lastValidIndex) {
      client.mutation(api.interactions.triggerAIGenerationAction, { seqIndex, interactionIndex })
    }
  })

  const redirectInfo = $derived({
    show:
      !sequence.data ||
      interactionIndex > (sequence.data?.interactions.length || 0) ||
      interactionIndex < 0,
    url: sequence.data ? `/seq/${seqIndex}/${sequence.data.interactions.length}` : '/',
    message: sequence.data
      ? `This interaction doesn't exist yet. The last valid interaction is at index ${sequence.data.interactions.length}.`
      : "This sequence doesn't exist.",
  })

  function submitAnswer() {
    console.log('Submitting action')
    // Implement your submission logic here
  }
</script>

<h1>Interaction in the sequence</h1>

{#if redirectInfo.show}
  <div>
    <p>{redirectInfo.message}</p>
    <button
      onclick={() =>
        goto(redirectInfo.url, { replaceState: true }).then(() => {
          location.reload()
        })}
    >
      {sequence.data ? 'Go to last interaction in sequence' : 'Go to homepage'}
    </button>
  </div>
{:else}
  <h3>All Parameters:</h3>
  <div>
    SeqIndex: {seqIndex}
    InteractionIndex: {interactionIndex}
  </div>

  {#if interaction.isLoading}
    <p>Loading interaction data...</p>
  {:else if interaction.error}
    <p>Error loading interaction: {interaction.error.toString()}</p>
  {:else if interaction.data}
    <h2>Interaction Details:</h2>
    {#if interaction.data.content.length > 0}
      <pre>{JSON.stringify(interaction.data.content, null, 2)}</pre>
    {:else}
      <pre>... 👾 Creating Interaction Content</pre>
    {/if}
  {:else}
    <p>No interaction at all at this index.</p>
  {/if}

  <div>SOLUTION (**hidden** until review-flow is done)</div>
  <button onclick={submitAnswer}>Submit</button>
  <div>Review, Remediation (wait for AI to review Submission)</div>
  <a href="/seq/{seqIndex}/{interactionIndex - 1}">Go back</a>
  <a href="/seq/{seqIndex}/{interactionIndex + 1}">Next (display on review-flow done)</a>
{/if}

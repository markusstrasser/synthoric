<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import SequencePreviewCard from '$components/SequencePreviewCard.svelte'
  import { api } from '$convex/_generated/api.js'
  import { useConvexClient, useQuery } from 'convex-svelte'

  let { form } = $props()

  $effect(() => {
    if (form?.error) {
      // display toast or error message
    }
  })

  const client = useConvexClient()
  const query = useQuery(api.sequences.getLatestK, { k: 3 })

  let isGenerating = $state(false)

  $inspect(query.data)

  // const generateSequences = async () => {
  //   isGenerating = true
  //   try {
  //     const res = await fetch('/api/sequences')
  //     const newSequences = await res.json()
  //     // Store generated sequences in Convex
  //     await Promise.all(
  //       newSequences.map(seq => client.mutation(api.sequences.create, { sequence: seq }))
  //     )
  //     // sequences = newSequences
  //   } catch (error) {
  //     console.error('Failed to generate sequences:', error)
  //   } finally {
  //     isGenerating = false
  //   }
  // }

  const handleSequenceClick = seq => goto(`/seq/${seq.index}/${seq.interactions.length}`)
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Synth" />
</svelte:head>

<section class="p-4">
  <h1 class="text-2xl font-bold mb-4">Synth</h1>
  <p>Available Sequences:</p>
  <!-- {@debug isLoading, sequences, error} -->
  {#if query.isLoading}
    Loading...
  {:else if query.error}
    failed to load: {query.error.toString()}
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each query.data as sequence}
        <SequencePreviewCard {...sequence} onClick={() => handleSequenceClick(sequence)} />
      {/each}
    </div>
  {/if}
  <div class="mt-4 flex space-x-2">
    <form
      method="post"
      use:enhance={() => {
        isGenerating = true

        return async ({ update }) => {
          isGenerating = false
          return update()
        }
      }}
    >
      <button
        type="submit"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
        disabled={query.isLoading}
      >
        {query.isLoading ? 'Loading...' : isGenerating ? 'Generating...' : 'Generate New Sequences'}
      </button>
    </form>
  </div>
</section>

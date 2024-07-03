<script lang="ts">
  import type { PageData } from './$types'
  import { onMount } from 'svelte'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { api } from '$convex/_generated/api.js'
  import { goto } from '$app/navigation'
  import SequencePreviewCard from '$components/SequencePreviewCard.svelte'

  const client = useConvexClient()
  const query = useQuery(api.sequences.getLatestK, { k: 3 })

  let isGenerating = $state(false)
  // let isLoading = $derived(sequences?.isLoading)

  // onMount(async () => {
  //   // isLoading = true
  //   try {
  //     sequences = await client.query(api.sequences.getLatestK, { k: 3 })
  //   } catch (error) {
  //     console.error('Failed to fetch initial sequences:', error)
  //   } finally {
  //     isLoading = false
  //   }
  // })

  const generateSequences = async () => {
    isGenerating = true
    try {
      const res = await fetch('/api/sequences')
      const newSequences = await res.json()
      // Store generated sequences in Convex
      await Promise.all(
        newSequences.map(seq => client.mutation(api.sequences.create, { sequence: seq }))
      )
      // sequences = newSequences
    } catch (error) {
      console.error('Failed to generate sequences:', error)
    } finally {
      isGenerating = false
    }
  }

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
        <SequencePreviewCard {sequence} onClick={() => handleSequenceClick(sequence)} />
      {/each}
    </div>
  {/if}
  <div class="mt-4 flex space-x-2">
    <button
      on:click={generateSequences}
      class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
      disabled={query.isLoading}
    >
      {query.isLoading ? 'Generating...' : 'Generate New Sequences'}
    </button>
  </div>
</section>

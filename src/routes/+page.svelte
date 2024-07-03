<script lang="ts">
  import { onMount } from 'svelte'
  import SequenceList from '../components/SequenceList.svelte'
  import type { SequencePreviewSchema } from '$lib/schemas'
  import type { z } from 'zod'
  import { localStore } from '$lib/stores/localStore.svelte'

  interface SequencePreview extends z.infer<typeof SequencePreviewSchema> {}

  const sequences = localStore<SequencePreview[]>('sequences', [])
  let isLoading = $state(false)

  const fetchSequences = async () => {
    isLoading = true
    try {
      const res = await fetch('/api/sequences')
      sequences.value = await res.json()
    } catch (error) {
      console.error('Failed to fetch sequences:', error)
    } finally {
      isLoading = false
    }
  }

  onMount(() => {
    if (sequences.value.length === 0) {
      fetchSequences()
    }
  })
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Synth" />
</svelte:head>

<section>
  <h1>Synth</h1>
  <p>Available Sequences:</p>
  <SequenceList sequences={sequences.value} {isLoading} />
  <button
    on:click={fetchSequences}
    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
    disabled={isLoading}
  >
    {isLoading ? 'Loading...' : 'Refresh Sequences'}
  </button>
</section>

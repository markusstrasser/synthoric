<script lang="ts">
  import type { SequencePreviewSchema } from '$lib/schemas'
  import type { z } from 'zod'
  import { useConvexClient } from 'convex-svelte'
  import { api } from '$convex/_generated/api.js'
  import { goto } from '$app/navigation'

  const client = useConvexClient()

  interface SequencePreview extends z.infer<typeof SequencePreviewSchema> {}

  export let sequences: SequencePreview[] = []
  export let isLoading = false

  const addSequence = () => {
    sequences = [...sequences, { tagline: 'New Sequence', title: 'Untitled', prerequisites: [] }]
  }
</script>

<div class="p-4">
  <h2 class="text-2xl font-bold mb-4">Sequences</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each sequences as sequence}
      <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold mb-2">{sequence.title}</h3>
        <p class="text-gray-600">{sequence.tagline}</p>
        <p class="text-gray-600"><b>Prereqs</b>: {sequence.prerequisites.join(', ')}</p>
        <button
          on:click={async () => {
            const res = await client.mutation(api.sequences.create, { sequence })
            console.log(res)
            goto(`/seq/${res.index}/${res.interactions.length}`)
          }}
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Go to Sequence!
        </button>
      </div>
    {/each}
  </div>

  <div class="mt-4 flex space-x-2">
    <button
      on:click={addSequence}
      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      disabled={isLoading}
    >
      Add Sequence
    </button>
  </div>
</div>

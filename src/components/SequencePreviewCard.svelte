<script lang="ts">
  import type { SequencePreviewSchema } from '$lib/schemas'
  import type { z } from 'zod'

  interface SequencePreview extends z.infer<typeof SequencePreviewSchema> {}

  export let sequence: SequencePreview
  export let onClick: () => void
</script>

<div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
  <h3 class="text-xl font-semibold mb-2">{sequence.title}</h3>
  <p class="text-gray-600">{sequence.tagline}</p>
  <p class="text-gray-600"><b>Prereqs</b>: {sequence.prerequisites.join(', ')}</p>
  <button
    on:click={onClick}
    class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
  >
    Go to Sequence!
  </button>
</div>

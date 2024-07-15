<script lang="ts">
  import type Tools from '$lib/tools'
  import type { z } from 'zod'

  type SequencePreview = z.infer<typeof Tools.SequencePreview.schema>
  const { title, tagline, prerequisites, onClick } = $props()
</script>

<div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
  <h3 class="text-xl font-semibold mb-2">{title}</h3>
  <p class="text-gray-600">{tagline}</p>
  <p class="text-gray-600"><b>Prereqs</b>: {prerequisites.join(', ')}</p>
  <button
    onclick={onClick}
    class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
  >
    Go to Sequence!
  </button>
</div>

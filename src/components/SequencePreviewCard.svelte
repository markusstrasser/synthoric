<script lang="ts">
  import type Tools from '$lib/tools'
  import type { z } from 'zod'

  type SequencePreview = z.infer<typeof Tools.SequencePreview.schema>
  const { title, tagline, prerequisites, onClick } = $props()
</script>

<div class="card p-6 space-y-4 hover:scale-105 transition-transform duration-300">
  <h3 class="text-2xl font-bold">{title}</h3>
  <p class="text-gray-600">{tagline}</p>
  <div>
    <h4 class="font-semibold mb-1">Prerequisites:</h4>
    <ul class="list-disc list-inside text-sm text-gray-500">
      {#each prerequisites as prereq}
        <li>{prereq}</li>
      {/each}
    </ul>
  </div>
  <button on:click={onClick} class="btn btn-primary w-full mt-4"> Start Sequence </button>
</div>

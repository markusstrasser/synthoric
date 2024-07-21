<script lang="ts">
  import * as Card from '$components/ui/card'
  import type Tools from '$lib/tools'
  import type { z } from 'zod'

  type SequencePreview = z.infer<typeof Tools.SequencePreview.schema>
  const { title, tagline, prerequisites, onClick, interactions } = $props<SequencePreview>()
</script>

<Card.Root class="bg-gray-50 transition-transform duration-300 hover:scale-105">
  <Card.Header>
    <Card.Title class="text-2xl font-bold">{title}</Card.Title>
    <Card.Description class="text-gray-600">{tagline}</Card.Description>
  </Card.Header>
  <Card.Content>
    <h4 class="mb-1 font-semibold">Prerequisites:</h4>
    <ul class="list-inside list-disc text-sm text-gray-500">
      {#each prerequisites as prereq}
        <li>{prereq}</li>
      {/each}
    </ul>
  </Card.Content>
  <Card.Content>
    {#if interactions.length > 0}
      <h4>Interactions: {interactions.length}</h4>
    {/if}
  </Card.Content>
  <Card.Footer>
    <button onclick={onClick} class="btn btn-primary mt-4 w-full">
      {interactions.length > 0 ? 'Continue Sequence' : 'Start Sequence'}
    </button>
  </Card.Footer>
</Card.Root>

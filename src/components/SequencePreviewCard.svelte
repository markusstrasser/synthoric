<script lang="ts">
  import * as Card from '$components/ui/card'
  import type { Doc } from '$convex/_generated/dataModel'
  import { Button } from '$components/ui/button'
  import { useQuery } from 'convex-svelte'
  import { api } from '$convex/_generated/api'

  let { _id, index, title, tagline, prerequisites, interactionsIds }: Doc<'sequences'> = $props()
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
  <Card.Footer>
    <Button href={`/seq/${index}/${interactionsIds?.length}`} variant="outline">
      Start Sequence
    </Button>
  </Card.Footer>
</Card.Root>

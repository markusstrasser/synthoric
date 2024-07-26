<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$components/ui/card'
  import { Star } from 'lucide-svelte'

  interface FeedbackProps {
    feedback: string
    notes: string
    rating: number
  }

  export let feedback: string
  // export let notes: string
  export let rating: number
</script>

<Card class="w-[350px]">
  <CardHeader>
    <CardTitle>Feedback</CardTitle>
  </CardHeader>
  <CardContent>
    <div class="space-y-4">
      <div>
        <h3 class="font-semibold">Comment:</h3>
        <p>{feedback}</p>
      </div>
      <!-- {#if notes}
        <div>
          <h3 class="font-semibold">Notes:</h3>
          <p>{notes}</p>
        </div>
      {/if} -->
      <div>
        <h3 class="font-semibold">Rating:</h3>
        <div class="flex items-center">
          {#each Array(3) as _, i}
            <Star
              class={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              size={20}
            />
          {/each}
        </div>
      </div>
    </div>
  </CardContent>
</Card>

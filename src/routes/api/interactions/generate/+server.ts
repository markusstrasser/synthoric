import { api } from '$convex/_generated/api'
import { convexClient } from '$lib/providers'
import { generateInteractionContent } from '$lib/ai'

export const POST = async ({ request }) => {
  console.log('generation endpoint')
  const { interactionId, sequenceIndex } = await request.json()
  console.log({ interactionId, sequenceIndex })

  if (!interactionId || sequenceIndex === undefined) {
    return new Response('Invalid request. InteractionId and sequenceIndex are required', {
      status: 400,
    })
  }

  // Update the status of the interaction
  // await convexClient.mutation(api.interactions.updateInteraction, {
  //   id: interactionId,
  //   interaction: {
  //     state: 'started',
  //   },
  // })

  const content = await generateInteractionContent(sequenceIndex)

  return new Response()
}

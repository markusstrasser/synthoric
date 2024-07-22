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
  await convexClient.mutation(api.interactions.updateInteraction, {
    id: interactionId,
    interaction: {
      state: 'started',
    },
  })

  try {
    const { content } = await generateInteractionContent(sequenceIndex)

    // Update the status of the interaction, and add the content
    await convexClient.mutation(api.interactions.updateInteraction, {
      id: interactionId,
      interaction: {
        state: 'completed',
        content,
      },
    })

    console.log('interaction generated')

    return new Response('Interaction generated', { status: 200 })
  } catch (error) {
    await convexClient.mutation(api.interactions.updateInteraction, {
      id: interactionId,
      interaction: {
        state: 'failed',
      },
    })

    console.error('Error generating interaction:', error)
    return new Response('Error generating interaction', { status: 500 })
  }
}

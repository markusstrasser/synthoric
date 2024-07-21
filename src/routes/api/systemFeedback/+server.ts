import { json, type RequestHandler } from '@sveltejs/kit'
import Tools from '$lib/tools'
import { convexClient } from '$lib/providers'
import { api } from '$convex/_generated/api'
import { summarizeInteraction } from '$lib/utils/index'

export const POST: RequestHandler = async ({ request }) => {
  const { interactionId } = await request.json()

  const interaction = await convexClient.query(api.interactions.getById, { id: interactionId })

  const interactionSummary = summarizeInteraction(interaction)

  console.log(interactionSummary)
  const submissionReview = await Tools.SubmissionReview.execute(interactionSummary)

  console.log(submissionReview, 'subreview')

  await convexClient.mutation(api.interactions.updateSystemFeedback, {
    interactionId,
    systemFeedback: submissionReview,
  })

  return json({ submissionReview })
}

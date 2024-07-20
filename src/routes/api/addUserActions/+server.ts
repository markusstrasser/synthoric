import type { RequestHandler } from '@sveltejs/kit'
import { json } from '@sveltejs/kit'
import { convexClient } from '$lib/providers'
import { api } from '$convex/_generated/api'
export const POST: RequestHandler = async ({ request }) => {
  const { userActions, interactionId } = await request.json()

  console.log(userActions, 'userActions')
  //TODO: summarize UserActions for LLM
  try {
    await convexClient.mutation(api.interactions.patchUserActions, {
      userActions,
      interactionId,
    })
  } catch (error) {
    console.error('Error generating next interaction:', error)
    return json({ success: false, error: 'Failed to generate next interaction' }, { status: 500 })
  }
  return json({ success: true })
}

import { convexClient } from './providers'
import { api } from '$convex/_generated/api'
import type { Id } from '$convex/_generated/dataModel'

//! only works in server for now?
export default {
  async updateLastSeen(interactionId: Id<'interactions'>) {
    return convexClient.mutation(api.interactions.updateLastSeen, { interactionId })
  },
  async updateUserActions(interactionId: Id<'interactions'>, userActions: any[]) {
    return convexClient.mutation(api.interactions.updateUserActions, { interactionId, userActions })
  },
  async updateSystemFeedback(interactionId: Id<'interactions'>, systemFeedback: any) {
    return convexClient.mutation(api.interactions.updateSystemFeedback, {
      interactionId,
      systemFeedback,
    })
  },
}

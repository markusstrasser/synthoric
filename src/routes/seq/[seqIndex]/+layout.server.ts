import { api } from '$convex/_generated/api'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, params }) => {
  const seqIndex = Number.parseInt(params.seqIndex)
  const sequence = await locals.convexClient.query(api.sequences.getByIndex, { index: seqIndex })

  if (!sequence) {
    error(404, {
      type: 'SEQUENCE_NOT_FOUND',
      message: 'Sequence not found',
    })
  }

  if (!('interactionIndex' in params)) {
    error(404, {
      type: 'INTERACTION_NOT_FOUND',
      message: 'Interaction not found',
    })
  }

  return {
    sequence,
  }
}

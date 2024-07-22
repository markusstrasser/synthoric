import { dev } from '$app/environment'
import { api } from '$convex/_generated/api'
import type { Doc } from '$convex/_generated/dataModel'
import { DEV_TUNNEL_URL } from '$env/static/private'
import { qstashClient } from '$lib/server/upstash'
import { error } from '@sveltejs/kit'

type InteractionState =
  | { type: 'OK' }
  | { type: 'SEQUENCE_NOT_FOUND' }
  | { type: 'INTERACTION_OUT_OF_BOUNDS'; lastAvailable: number }
  | { type: 'NEW_INTERACTION' }
  | { type: 'INTERACTION_NOT_FOUND' }

const getInteractionIdByIndex = async (interactionIndex: number, sequence: Doc<'sequences'>) => {
  const interactionIds = sequence.interactionsIds
  if (!interactionIds) return null

  const interactionId = interactionIds[interactionIndex]

  return interactionId
}

const getInteractionState = async (
  interactionIndex: number,
  sequence: Doc<'sequences'>
): Promise<InteractionState> => {
  const interactionCount = sequence.interactionsIds?.length ?? 0
  const lastExistingInteractionIndex = interactionCount - 1

  if (interactionIndex > lastExistingInteractionIndex + 1) {
    return {
      type: 'INTERACTION_OUT_OF_BOUNDS',
      lastAvailable: lastExistingInteractionIndex,
    }
  }

  if (interactionIndex === lastExistingInteractionIndex + 1) {
    return { type: 'NEW_INTERACTION' }
  }

  return { type: 'OK' }
}

export const load = async ({ fetch, locals, params, parent, url }) => {
  const { sequence } = await parent()

  const interactionIndex = Number.parseInt(params.interactionIndex)

  const interactionId = await getInteractionIdByIndex(interactionIndex, sequence)
  let interaction: Doc<'interactions'> | null = null

  if (interactionId)
    interaction = await locals.convexClient.query(api.interactions.getById, {
      id: interactionId,
    })

  const interactionState = await getInteractionState(interactionIndex, sequence)
  console.log('interactionState', interactionState)

  if (interactionState.type === 'INTERACTION_OUT_OF_BOUNDS') {
    error(404, {
      message: 'Interaction out of bounds',
      type: interactionState.type,
    })
  }

  if (interactionState.type === 'INTERACTION_NOT_FOUND') {
    error(404, {
      message: 'Interaction not found',
      type: interactionState.type,
    })
  }

  if (interactionState.type === 'NEW_INTERACTION') {
    const interactionId = await locals.convexClient.mutation(api.interactions.create, {
      interaction: {},
    })

    const { _creationTime, _id, ...rest } = sequence
    await locals.convexClient.mutation(api.sequences.updateSequence, {
      id: sequence._id,
      sequence: {
        ...rest,
        interactionsIds: [...(sequence.interactionsIds ?? []), interactionId],
      },
    })

    const endpoint = dev
      ? `${DEV_TUNNEL_URL}/api/interactions/generate`
      : `${url.origin}/api/interactions/generate`

    console.log('endpoint', endpoint)

    await qstashClient.publishJSON({
      url: endpoint,
      body: {
        interactionId,
        sequenceIndex: sequence.index,
      },
    })
  }

  console.log('interactionId', interactionId)

  return {
    sequence,
    interaction,
    interactionId,
    interactionState,
    currentInteractionIndex: interactionIndex,
  }
}

// //TODO: can call from other routes
// export const actions: Actions = {
//   next: async ({ params, url, setHeaders, request }) => {
//     const { seqIndex, interactionIndex } = params
//     const nextInteractionIndex = Number(interactionIndex) + 1
//     throw redirect(303, `/seq/${seqIndex}/${nextInteractionIndex}`)
//   },
//   previous: async ({ params }) => {
//     const { seqIndex, interactionIndex } = params
//     const previousInteractionIndex = Number(interactionIndex) - 1
//     if (previousInteractionIndex < 0) {
//       throw redirect(303, `/seq/${seqIndex}`)
//     }
//     throw redirect(303, `/seq/${seqIndex}/${previousInteractionIndex}`)
//   },
// }

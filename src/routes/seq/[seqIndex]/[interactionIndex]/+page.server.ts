import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { api } from '$convex/_generated/api'
import { convexClient } from '$lib/providers'
const mockPosts = [
  { slug: '0', title: 'Post 0', content: 'hello' },
  { slug: '1', title: 'Post 1', content: 'hello' },
  { slug: '2', title: 'Post 2', content: 'hello' },
]

const mockDB = async (seqIndex: number, interactionIndex: number) => {
  // Simulate async DB call
  await new Promise(resolve => setTimeout(resolve, 10))
  return mockPosts.find(post => post.slug === interactionIndex.toString())
}

type InteractionState =
  | { type: 'OK' }
  | { type: 'SEQUENCE_NOT_FOUND' }
  | { type: 'INTERACTION_OUT_OF_BOUNDS'; lastAvailable: number }
  | { type: 'NEW_INTERACTION' }
  | { type: 'INTERACTION_NOT_FOUND' }

export const load: PageServerLoad = async ({ params }) => {
  const seqIndex = Number.parseInt(params.seqIndex)
  const interactionIndex = Number.parseInt(params.interactionIndex)

  console.log('seqIndex', seqIndex)
  console.log('interactionIndex', interactionIndex)

  //? either will return null if not present
  const sequence = await convexClient.query(api.sequences.getByIndex, { index: seqIndex })
  const interactionId = sequence?.interactions[interactionIndex]
  const interaction =
    interactionId &&
    (await convexClient.query(api.interactions.getById, {
      id: interactionId,
    }))

  console.log(sequence, interaction)

  let interactionState: InteractionState = { type: 'OK' }
  const interactionCount = sequence?.interactions?.length ?? 0
  const lastExistingInteractionIndex = interactionCount - 1
  if (!sequence) {
    interactionState = { type: 'SEQUENCE_NOT_FOUND' }
  } else {
    if (interactionIndex > lastExistingInteractionIndex + 1) {
      interactionState = {
        type: 'INTERACTION_OUT_OF_BOUNDS',
        lastAvailable: lastExistingInteractionIndex,
      }
    } else if (interactionIndex === lastExistingInteractionIndex + 1) {
      interactionState = { type: 'NEW_INTERACTION' }
    } else if (!interaction) {
      interactionState = { type: 'INTERACTION_NOT_FOUND' }
    }
  }
  console.log(interactionState, 'interactionState')

  return {
    sequence,
    interaction,
    interactionState,
    currentInteractionIndex: interactionIndex,
    lastExistingInteractionIndex,
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

import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

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

export const load: PageServerLoad = async ({ params }) => {
  const seqIndex = Number.parseInt(params.seqIndex)
  const interactionIndex = Number.parseInt(params.interactionIndex)

  console.log('seqIndex', seqIndex)
  console.log('interactionIndex', interactionIndex)
  const post = await mockDB(Number(seqIndex), Number(interactionIndex))
  const [sequence, interaction] = await Promise.all([
    convexClient.query(api.sequences.getByIndex, { index: seqIndex }),
    convexClient.query(api.interactions.getByIndices, {
      seqIndex,
      interactionIndex,
    }),
  ])

  const interactionCount = sequence?.interactions?.length ?? 0
  const lastExistingInteractionIndex = sequence ? Math.max(interactionCount - 1, 0) : -1

  // if (!post) {
  //   throw error(404, 'Post not found')
  // }

  return { post, sequence, interaction, lastExistingInteractionIndex }
}

import { fail } from '@sveltejs/kit'
import { api } from '$convex/_generated/api'
import { convexClient } from '$lib/providers'

export const actions: Actions = {
  next: async ({ params, url, setHeaders, request }) => {
    const { seqIndex, interactionIndex } = params
    const nextInteractionIndex = Number(interactionIndex) + 1
    throw redirect(303, `/seq/${seqIndex}/${nextInteractionIndex}`)
  },
  previous: async ({ params }) => {
    const { seqIndex, interactionIndex } = params
    const previousInteractionIndex = Number(interactionIndex) - 1
    if (previousInteractionIndex < 0) {
      throw redirect(303, `/seq/${seqIndex}`)
    }
    throw redirect(303, `/seq/${seqIndex}/${previousInteractionIndex}`)
  },
}

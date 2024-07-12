import { api } from '$convex/_generated/api.js';

export const load = async ({locals}) => {
};

export const actions = {
  default: async ({ fetch, locals }) => {
    try {
      const res = await fetch('/api/sequences')
      const newSequences = await res.json()
      // Store generated sequences in Convex
      await Promise.all(
        newSequences.map(seq => locals.convexClient.mutation(api.sequences.create, { sequence: seq }))
      )
      // sequences = newSequences

      return {
        hello: 'world',
      }
    } catch (error) {
      console.error('Failed to generate sequences:', error)
      //   return fail(500, {
      //     error: 'Failed to generate sequences',
      //   })

      return {
        error: 'Failed to generate sequences',
      }
    }
  },
}

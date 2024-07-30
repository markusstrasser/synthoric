import { api } from '$convex/_generated/api.js'
import type { Actions } from './$types'

export const load = async ({ locals }) => {}

export const actions: Actions = {
  default: async ({ request, fetch, locals }) => {
    try {
      const data = await request.formData()
      const type = data.get('type')
      const isInterleaved = type === 'interleaved'
      const res = await fetch('/api/sequences', {
        method: 'POST',
        body: JSON.stringify({ isInterleaved }),
      })
      const newSequences = await res.json()
      // Store generated sequences in Convex
      await Promise.all(
        newSequences.map(seq =>
          locals.convexClient.mutation(api.sequences.create, { sequence: seq })
        )
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

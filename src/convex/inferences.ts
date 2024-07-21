import { query } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const get = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query('inferences').order('desc').collect()
  },
})

export const getWithSourcesMapped = query({
  args: {},
  handler: async ({ db }) => {
    const inferences = await db.query('inferences').order('desc').collect()
    for (const inference of inferences) {
      inference.sources.map(async (source: any) => {
        const mappedSource = await db.get(source.id)
        return { ...source, mappedSource }
      })
    }
    return inferences
  },
})

export const create = mutation({
  args: {
    inference: v.any(),
  },
  handler: async (ctx, { inference }) => {
    return await ctx.db.insert('inferences', inference)
  },
})

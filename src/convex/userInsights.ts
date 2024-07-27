import { query } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'
import { zCustomQuery, zCustomMutation } from 'convex-helpers/server/zod'
import { NoOp } from 'convex-helpers/server/customFunctions'

export const get = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query('userInsights').order('desc').collect()
  },
})

export const getWithSourcesMapped = query({
  args: {},
  handler: async ({ db }) => {
    const userInsights = await db.query('userInsights').order('desc').collect()
    for (const userInsight of userInsights) {
      userInsight.sources.map(async (source: any) => {
        const mappedSource = await db.get(source.id)
        return { ...source, mappedSource }
      })
    }
    return userInsights
  },
})

export const create = mutation({
  args: {
    userInsight: v.any(),
  },
  handler: async (ctx, { userInsight }) => {
    return await ctx.db.insert('userInsights', userInsight)
  },
})

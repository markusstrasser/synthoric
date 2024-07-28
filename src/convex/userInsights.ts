import { query } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'
import { zCustomQuery, zCustomMutation } from 'convex-helpers/server/zod'
import { NoOp } from 'convex-helpers/server/customFunctions'
import { getAll } from 'convex-helpers/server/relationships'

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

    const mappedUserInsights = await Promise.all(
      userInsights.map(async userInsight => {
        const sourceIds = userInsight.sources.map((source: any) => source.sourceId)
        const mappedSources = await getAll(db, sourceIds)

        const updatedSources = userInsight.sources.map((source: any, index: number) => ({
          ...source,
          mappedSource: mappedSources[index],
        }))

        return { ...userInsight, sources: updatedSources }
      })
    )

    return mappedUserInsights
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

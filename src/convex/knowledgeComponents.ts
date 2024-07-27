import { query } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'
import { zCustomQuery, zCustomMutation } from 'convex-helpers/server/zod'
import { NoOp } from 'convex-helpers/server/customFunctions'

export const create = mutation({
  args: {
    knowledgeComponent: v.string(),
  },
  handler: async (ctx, { knowledgeComponent }) => {
    // const lastEntry = await ctx.db.query('knowledgeComponents').order('desc').first()
    // const lastIndex = lastEntry?.index
    // const startIndex = lastIndex ? lastIndex + 1 : 0

    return await ctx.db.insert('knowledgeComponents', { content: knowledgeComponent })
  },
})

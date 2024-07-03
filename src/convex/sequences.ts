import { Id } from './_generated/dataModel'
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { z } from 'zod'
import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomQuery, zCustomMutation, zid } from 'convex-helpers/server/zod'

export const create = mutation({
  args: {
    sequence: v.any(),
  },
  handler: async (ctx, { sequence }) => {
    const lastSequence = await ctx.db.query('sequences').order('desc').first()
    console.log(lastSequence)
    const index = lastSequence ? lastSequence.index + 1 : 0
    const seq = { ...sequence, index, interactions: [] }
    await ctx.db.insert('sequences', seq)
    return seq
  },
})
/* TODO: 

1. create a new sequence 
2. give 'index' prop = collect().length +1
3. trigger action
*/

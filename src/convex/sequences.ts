import { Id } from './_generated/dataModel'
import { query, mutation, action, internalQuery } from './_generated/server'
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
    //create first interaction by default

    const seq = { ...sequence, index, interactions: [] }
    await ctx.db.insert('sequences', seq)
    return seq
  },
})
export const getLatestK = query({
  args: {
    k: v.number(),
  },
  handler: async (ctx, { k }) => {
    return await ctx.db.query('sequences').order('desc').take(k)
  },
})

export const getByIndex = query({
  args: {
    index: v.number(),
  },
  handler: async (ctx, { index }) => {
    return await ctx.db
      .query('sequences')
      .filter(q => q.eq(q.field('index'), index))
      .first()
  },
})

export const getInteractionByIndex = query({
  args: {
    seqIndex: v.number(),
    interactionIndex: v.number(),
  },
  handler: async (ctx, { seqIndex, interactionIndex }) => {
    const seq = await ctx.db
      .query('sequences')
      .filter(q => q.eq(q.field('index'), seqIndex))
      .first()
    if (!seq) {
      throw new Error('Sequence not found')
    }
    if (interactionIndex >= seq.interactions.length) {
      return null
    }

    return seq.interactions[interactionIndex]
  },
})
/* TODO: 

1. create a new sequence 
2. give 'index' prop = collect().length +1
3. trigger action
*/

import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { Doc, type Id } from './_generated/dataModel'

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

export const getWithFullInteractions = query({
  args: {
    index: v.number(),
  },
  handler: async (ctx, { index }) => {
    const sequence = await ctx.db
      .query('sequences')
      .filter(q => q.eq(q.field('index'), index))
      .first()

    if (!sequence) {
      return null
    }

    // Fetch the full interaction data for each interactionId
    const interactionsInSeq = await Promise.all(
      sequence.interactions.map(async (interactionId: Id<'interactions'>) => {
        return await ctx.db.get(interactionId)
      })
    )

    // Return the sequence with the full interactions data
    return {
      sequence,
      interactionsInSeq,
    }
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
      return 'hi'
    }

    return seq.interactions[interactionIndex]
  },
})
/* TODO: 

1. create a new sequence 
2. give 'index' prop = collect().length +1
3. trigger action
*/

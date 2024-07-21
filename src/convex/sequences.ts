import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { Sequence } from './schema'

export const create = mutation({
  args: {
    sequence: Sequence,
  },
  handler: async (ctx, { sequence }) => {
    await ctx.db.insert('sequences', sequence)
  },
})

export const updateSequence = mutation({
  args: {
    id: v.id('sequences'),
    sequence: Sequence,
  },
  handler: async ({ db }, { id, sequence }) => {
    return await db.patch(id, sequence)
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

export const getSequencesCount = query({
  handler: async ctx => {
    return (await ctx.db.query('sequences').collect()).length
  },
})

export const getInteractionsCount = query({
  args: {
    id: v.id('sequences'),
  },
  handler: async (ctx, { id }) => {
    const seq = await ctx.db.get(id)
    return seq?.interactionsIds?.length ?? 0
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

// export const getInteractionByIndex = query({
//   args: {
//     seqIndex: v.number(),
//     interactionIndex: v.number(),
//   },
//   handler: async (ctx, { seqIndex, interactionIndex }) => {
//     const seq = await ctx.db
//       .query('sequences')
//       .filter(q => q.eq(q.field('index'), seqIndex))
//       .first()
//     if (!seq) {
//       throw new Error('Sequence not found')
//     }
//     if (interactionIndex >= seq.interactions.length) {
//       return 'hi'
//     }

//     return seq.interactions[interactionIndex]
//   },
// })
// /* TODO:

// 1. create a new sequence
// 2. give 'index' prop = collect().length +1
// 3. trigger action
// */

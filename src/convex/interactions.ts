import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { Interaction } from './schema'
// import { z } from 'zod'
// import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
// import { zCustomQuery, zCustomMutation, zid } from 'convex-helpers/server/zod'
// import * as s from '../lib/schemas'
// import { SubmissionReview } from '../lib/tools/AIToolConfigs'
// import { UserAction } from '../lib/schemas'
// // Types based on your schema
// import type { Id } from './_generated/dataModel'
// import type { Doc } from './_generated/dataModel'

// // Helper functions
// //@ts-ignore
// const getCurrentInteraction = async db => {
//   const [interaction] = await db.query('interactions').order('desc').take(1)
//   return interaction
// }

// const zodQuery = zCustomQuery(query, NoOp)

// const zMutation = zCustomMutation(
//   mutation,
//   customCtx(async ({ db }) => {
//     const lastInteraction = await getCurrentInteraction(db)
//     return { lastInteractionId: lastInteraction?._id, db }
//   })
// )

export const getContext = query({
  args: { seqIndex: v.number() },
  handler: async (ctx, { seqIndex }) => {
    const [interactions, inferences, seq] = await Promise.all([
      ctx.db.query('interactions').collect(),
      ctx.db.query('inferences').collect(),
      ctx.db
        .query('sequences')
        .filter(q => q.eq(q.field('index'), seqIndex))
        .first(),
    ])
    return { interactions, inferences, seq }
  },
})

export const updateInteraction = mutation({
  args: {
    id: v.id('interactions'),
    interaction: Interaction,
  },
  handler: async ({ db }, { id, interaction }) => {
    return await db.patch(id, interaction)
  },
})

// export const listScheduledMessages = query({
//   args: {},
//   handler: async (ctx, args) => {
//     return await ctx.db.system.query('_scheduled_functions').collect()
//   },
// })

// export const upsertLastVisited = zMutation({
//   args: {
//     seqIndex: z.number(),
//     interactionIndex: z.number(),
//   },
//   handler: async (ctx, { seqIndex, interactionIndex }) => {
//     const interaction = await getByIndices(ctx, { seqIndex, interactionIndex })
//     const time = 'testtime' // new Date(Date.now())
//     if (!interaction) {
//       throw new Error('Interaction not found when trying to upsertLastVisitedTime')
//     }
//     return await ctx.db.patch(interaction._id, { lastVisited: time })
//   },
// })

// export const insertInteractionAndLinkToSequence = mutation({
//   args: {
//     interactionContent: v.any(),
//     seqId: v.id('sequences'),
//   },
//   handler: async (ctx, { interactionContent, seqId }) => {
//     const interactionId = await ctx.db.insert('interactions', {
//       content: interactionContent,
//     })

//     const seq = await ctx.db.get(seqId)
//     seq.interactions.push(interactionId)
//     seq.lastUpdated = Date.now()

//     await ctx.db.patch(seqId, seq)

//     return interactionId
//   },
// })

// export const getByIndices = query({
//   args: { seqIndex: v.number(), interactionIndex: v.number() },
//   handler: async (ctx, { seqIndex, interactionIndex }): Promise<Doc['interactions'] | null> => {
//     const seq = await ctx.db
//       .query('sequences')
//       .filter(q => q.eq(q.field('index'), seqIndex))
//       .first()

//     const interactionId = seq.interactions[interactionIndex]
//     return await ctx.db.get(interactionId)
//   },
// })

// export const patchUserActions = zMutation({
//   args: {
//     userActions: z.array(UserAction),
//     interactionId: zid('interactions'),
//   },
//   handler: async ({ db }, { userActions, interactionId }) =>
//     db.patch(interactionId, { userActions }),
// })

// export const patchSystemFeedback = zMutation({
//   args: {
//     systemFeedback: SubmissionReview.schema,
//     interactionId: zid('interactions'),
//   },
//   handler: async ({ db }, { systemFeedback, interactionId }) =>
//     db.patch(interactionId, { systemFeedback }),
// })

// // Queries
// export const getSince = zodQuery({
//   args: { timeStamp: z.number() },
//   handler: async ({ db }, { timeStamp }) =>
//     db
//       .query('interactions')
//       .filter(q => q.gte(q.field('timeStamp'), timeStamp))
//       .collect(),
// })

// export const getBySeqId = zodQuery({
//   args: { seqId: z.string() },
//   handler: async ({ db }, { seqId }) =>
//     db
//       .query('interactions')
//       .filter(q => q.eq(q.field('seqId'), seqId))
//       .collect(),
// })

export const getById = query({
  args: { id: v.id('interactions') },
  handler: async ({ db }, { id }) => db.get(id),
})

export const create = mutation({
  args: {
    interaction: Interaction,
  },
  handler: async ({ db }, { interaction }) => {
    return await db.insert('interactions', { ...interaction })
  },
})

// export const getLast = zodQuery({
//   args: {},
//   handler: getCurrentInteraction,
// })

// export const getAll = zodQuery({
//   args: {},
//   handler: async ({ db }) => db.query('interactions').order('desc').collect(),
// })

// export const get = zodQuery({
//   args: { test: z.string().optional() },
//   handler: async ({ db }) => db.query('interactions').collect(),
// })

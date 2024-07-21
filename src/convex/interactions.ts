import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { z } from 'zod'
import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomQuery, zCustomMutation, zid } from 'convex-helpers/server/zod'
import * as s from '../lib/schemas'
import { SubmissionReview } from '../lib/tools/AIToolConfigs'
import { UserAction } from '../lib/schemas'
// Types based on your schema
import type { Id } from './_generated/dataModel'
import type { Doc } from './_generated/dataModel'

// Helper functions
//@ts-ignore
const getCurrentInteraction = async db => {
  const [interaction] = await db.query('interactions').order('desc').take(1)
  return interaction
}

const zodQuery = zCustomQuery(query, NoOp)

const zMutation = zCustomMutation(
  mutation,
  customCtx(async ({ db }) => {
    const lastInteraction = await getCurrentInteraction(db)
    return { lastInteractionId: lastInteraction?._id, db }
  })
)

export const getContext = query({
  args: { seqIndex: v.number() },
  handler: async (ctx, { seqIndex }) => {
    const [interactions, inferences, sequence] = await Promise.all([
      ctx.db.query('interactions').collect(),
      ctx.db.query('inferences').collect(),
      ctx.db
        .query('sequences')
        .filter(q => q.eq(q.field('index'), seqIndex))
        .first(),
    ])
    return { interactions, inferences, sequence }
  },
})

export const listScheduledMessages = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.system.query('_scheduled_functions').collect()
  },
})

export const updateLastSeen = zMutation({
  args: {
    interactionId: zid('interactions'),
  },
  handler: async (ctx, { interactionId }) => {
    if (!interactionId) {
      throw new Error('Interaction not found when trying to upsertLastVisitedTime')
    }
    const interaction = await ctx.db.get(interactionId)
    const lastSeen = Date.now()
    const firstSeen = interaction?.firstSeen || lastSeen

    return await ctx.db.patch(interactionId, { firstSeen, lastSeen })
  },
})

export const insertInteractionAndLinkToSequence = mutation({
  args: {
    interactionContent: v.any(),
    seqId: v.id('sequences'),
  },
  handler: async (ctx, { interactionContent, seqId }) => {
    const interactionId = await ctx.db.insert('interactions', {
      content: interactionContent,
    })

    const seq = await ctx.db.get(seqId)
    seq.interactions.push(interactionId)
    seq.lastUpdated = Date.now()

    await ctx.db.patch(seqId, seq)

    return interactionId
  },
})

export const getByIndices = query({
  args: { seqIndex: v.number(), interactionIndex: v.number() },
  handler: async (ctx, { seqIndex, interactionIndex }): Promise<Doc['interactions'] | null> => {
    const seq = await ctx.db
      .query('sequences')
      .filter(q => q.eq(q.field('index'), seqIndex))
      .first()

    try {
      const interactionId = seq.interactions[interactionIndex]
      return await ctx.db.get(interactionId)
    } catch (e) {
      console.error(e, 'no interaction found at indices', seqIndex, interactionIndex)
      return null
    }
  },
})

export const updateUserActions = zMutation({
  args: {
    userActions: z.array(z.any()),
    interactionId: zid('interactions'),
  },
  handler: async ({ db }, { userActions, interactionId }) =>
    db.patch(interactionId, { userActions }),
})

export const updateSystemFeedback = zMutation({
  args: {
    systemFeedback: SubmissionReview.schema,
    interactionId: zid('interactions'),
  },
  handler: async ({ db }, { systemFeedback, interactionId }) =>
    db.patch(interactionId, { systemFeedback }),
})

// Queries
export const getSince = zodQuery({
  args: { timeStamp: z.number() },
  handler: async ({ db }, { timeStamp }) =>
    db
      .query('interactions')
      .filter(q => q.gte(q.field('timeStamp'), timeStamp))
      .collect(),
})

export const getBySeqId = zodQuery({
  args: { seqId: z.string() },
  handler: async ({ db }, { seqId }) =>
    db
      .query('interactions')
      .filter(q => q.eq(q.field('seqId'), seqId))
      .collect(),
})

export const getById = zodQuery({
  args: { id: zid('interactions') },
  handler: async ({ db }, { id }) => db.get(id),
})

export const getLast = zodQuery({
  args: {},
  handler: getCurrentInteraction,
})

export const getAll = zodQuery({
  args: {},
  handler: async ({ db }) => db.query('interactions').order('desc').collect(),
})

export const get = zodQuery({
  args: { test: z.string().optional() },
  handler: async ({ db }) => db.query('interactions').collect(),
})

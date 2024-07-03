// @ts-nocheck

import { Id } from './_generated/dataModel'
import { query, mutation, action, internalMutation, internalQuery } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'
import { z } from 'zod'
import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomQuery, zCustomMutation, zid } from 'convex-helpers/server/zod'
import { UserActionSchema, SubmissionReviewSchema } from '../lib/schemas'

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

// // Mutations

//@ts-ignore
const generateNextInteraction = async ctx => {
  const context = ctx.db //TODO: get context
  const interaction = await { content: { test: 'test Inter' } } //TODO: internalAction -> generateObject
  return interaction
}
export const getByIndices = query({
  args: { seqIndex: v.number(), interactionIndex: v.number() },
  handler: async ({ db }, { seqIndex, interactionIndex }) =>
    await db
      .query('interactions')
      .filter(q => q.eq(q.field('seqIndex'), seqIndex))
      .filter(q => q.eq(q.field('interactionIndex'), interactionIndex))
      .first(),
})
//!Failed to analyze interactions.js: Uncaught Error: Unknown zod type: ZodDate
export const create = zMutation({
  args: {
    userActions: z.array(UserActionSchema).optional(), //? don't use z.date
    seqIndex: z.number(),
    interactionIndex: z.number(),
    // content: z.any(),
    // index: z.number(),
  },
  handler: async (ctx, { seqIndex, interactionIndex }) => {
    const interaction = await generateNextInteraction(ctx, seqIndex)
    const interactionId = await ctx.db.insert('interactions', {
      ...interaction,
      seqIndex,
      interactionIndex,
    })

    const seq = await ctx.db
      .query('sequences')
      .filter(q => q.eq(q.field('index'), seqIndex))
      .first()
    seq.interactions.push(interactionId)
    await ctx.db.patch(seq._id, seq)
    return true
  },
})

export const patchUserActions = zMutation({
  args: {
    userActions: z.array(UserActionSchema),
    interactionId: zid('interactions'),
  },
  handler: async ({ db }, { userActions, interactionId }) =>
    db.patch(interactionId, { userActions }),
})

export const patchSystemFeedback = zMutation({
  args: {
    systemFeedback: SubmissionReviewSchema,
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

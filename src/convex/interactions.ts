import { Id } from './_generated/dataModel'
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { z } from 'zod'
import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomQuery, zCustomMutation, zid } from 'convex-helpers/server/zod'
import { UserActionSchema, SubmissionReviewSchema } from '../lib/zodSchemas'

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
//!Failed to analyze interactions.js: Uncaught Error: Unknown zod type: ZodDate
export const create = zMutation({
  args: {
    userActions: z.array(UserActionSchema).optional(), //? don't use z.date
    seqId: z.string(),
    content: z.any(),
    index: z.number(),
  },
  handler: async (ctx, args) => ctx.db.insert('interactions', args),
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

import { query, mutation, internalMutation } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'
import { z } from 'zod'
import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomQuery, zCustomMutation, zid } from 'convex-helpers/server/zod'
import * as s from '../lib/schemas'
import Tools from '../lib/tools'
import createContextPrompt from '../lib/createContextPrompt'
// Types based on your schema
import type { Id } from './_generated/dataModel'

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

export const triggerAIGenerationAction = mutation({
  //? running this instead of the action because of convex timeouts and best practices
  args: { seqIndex: v.number(), interactionIndex: v.number() },
  handler: async (ctx, { seqIndex, interactionIndex }) => {
    await ctx.db.insert('cache', { status: 'Interaction Generation: Gathering Context' })

    const [interactions, inferences, seq] = await Promise.all([
      ctx.db.query('interactions').collect(),
      ctx.db.query('inferences').collect(),
      ctx.db
        .query('sequences')
        .filter(q => q.eq(q.field('index'), seqIndex))
        .first(),
    ])

    if (!seq) throw new Error(`Sequence with index ${seqIndex} not found`)

    const contextStr = createContextPrompt({
      interactions,
      inferences,
      seqIndex,
      tagline: seq.tagline,
    })
    await ctx.scheduler.runAfter(0, internal.interactionAction.create, {
      seqIndex,
      interactionIndex,
      contextStr,
      seq,
    })
  },
})

export const listScheduledMessages = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.system.query('_scheduled_functions').collect()
  },
})

export const upsertLastVisited = zMutation({
  args: {
    seqIndex: z.number(),
    interactionIndex: z.number(),
  },
  handler: async (ctx, { seqIndex, interactionIndex }) => {
    const interaction = await getByIndices(ctx, { seqIndex, interactionIndex })
    if (!interaction) {
      ctx.db.insert('interactions', {
        seqIndex,
        interactionIndex,
        lastVisited: Date.now(),
      })
    } else {
      return await ctx.db.patch(interaction._id, { lastVisited: Date.now() })
    }
  },
})

export const insertInteractionAndLinkToSequence = internalMutation({
  args: {
    content: v.any(),
    seqIndex: v.number(),
    interactionIndex: v.number(),
    seqId: v.id('sequences'),
  },
  handler: async (ctx, { content, seqIndex, interactionIndex, seqId }) => {
    const interactionId = await ctx.db.insert('interactions', {
      content,
      seqIndex,
      interactionIndex,
    })

    await ctx.db.patch(seqId, {
      interactions: (prev: Id<'interactions'>[]) => [...prev, interactionId],
      lastUpdated: new Date().toISOString(),
    })

    return interactionId
  },
})

export const getByIndices = query({
  args: { seqIndex: v.number(), interactionIndex: v.number() },
  handler: async ({ db }, { seqIndex, interactionIndex }) =>
    await db
      .query('interactions')
      .filter(q => q.eq(q.field('seqIndex'), seqIndex))
      .filter(q => q.eq(q.field('interactionIndex'), interactionIndex))
      .first(),
})

export const patchUserActions = zMutation({
  args: {
    userActions: z.array(s.UserAction),
    interactionId: zid('interactions'),
  },
  handler: async ({ db }, { userActions, interactionId }) =>
    db.patch(interactionId, { userActions }),
})

export const patchSystemFeedback = zMutation({
  args: {
    systemFeedback: Tools.SubmissionReview.schema,
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

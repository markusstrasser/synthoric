import { Id } from './_generated/dataModel.d'
import { query } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'
import { z } from 'zod'
import { customCtx } from 'convex-helpers/server/customFunctions'
import { zCustomQuery, zCustomMutation, zid } from 'convex-helpers/server/zod'
import { NoOp } from 'convex-helpers/server/customFunctions'
import { UserActionSchema, SubmissionReviewSchema } from '../src/lib/zodSchemas'
// Define this once - and customize like you would customQuery
const zodQuery = zCustomQuery(query, NoOp)
// Create a new task with the given text
export const create = mutation({
  args: {
    // displayOrder: v.array(v.any()),
    // id: v.optional(v.string()),
    userActions: v.optional(v.object({})),
    seqId: v.string(),
    content: v.any(),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('interactions', { ...args })
  },
})

const exampleUserActions = [
  {
    id: 'action1',
    displayIndex: 1,
    fromSpec: 'TASK',
    value: 'Example task value',
    timeStamp: 12314123123,
  },
  {
    id: 'action2',
    displayIndex: 2,
    fromSpec: 'SOLUTION',
    value: 'Example solution value',
    timeStamp: 12314123123,
  },
  {
    id: 'action3',
    displayIndex: 3,
    fromSpec: 'TextInput',
    value: { test: 'sss', a: 5 },
    timeStamp: 12314123123,
  },
]

//@ts-ignore
const getCurrentInteraction = async (db) => {
  const interaction = await db.query('interactions').order('desc').take(1)
  return interaction[0]
}
const zMutation = zCustomMutation(
  mutation,
  //? this is good for all interactionInteraction cruds
  customCtx(async ({ db }) => {
    const lastInteraction = await getCurrentInteraction(db)
    return { lastInteractionId: lastInteraction._id, db }
  }),
)

export const patchUserActions = zMutation({
  args: {
    userActions: z.array(UserActionSchema),
    interactionId: zid('interactions'),
  },
  handler: async ({ lastInteractionId, db }, args) => {
    const { userActions, interactionId } = args
    return await db.patch(interactionId, { userActions })
  },
})

export const patchSystemFeedback = zMutation({
  args: {
    systemFeedback: SubmissionReviewSchema,
    interactionId: zid('interactions'),
  },
  handler: async ({ lastInteractionId, db }, args) => {
    const { systemFeedback, interactionId } = args
    console.log(systemFeedback, interactionId, 'systemFeedback, interactionId')
    const res = await db.patch(interactionId, { systemFeedback })
    console.log(res, 'response patchsystemfeedback')
    return res
  },
})

export const getSince = query({
  args: { timeStamp: v.number() },
  handler: async ({ db }, { timeStamp }) => {
    return await db
      .query('interactions')
      .filter((q) => q.gte(q.field('timeStamp'), timeStamp))
      .collect()
  },
})

export const getBySeqId = query({
  args: { seqId: v.string() },
  handler: async ({ db }, { seqId }) => {
    return await db
      .query('interactions')
      .filter((q) => q.eq(q.field('seqId'), seqId))
      .collect()
  },
})

export const getById = query({
  args: { id: v.id('interactions') },
  handler: async ({ db }, { id }) => {
    return await db.get(id)
  },
})
export const getLast = query({
  args: {},
  handler: async ({ db }) => {
    return await getCurrentInteraction(db)
  },
})

export const getAll = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query('interactions').order('desc').collect()
  },
})

export const customGet = zCustomQuery(
  query,
  customCtx(async (ctx) => {
    const interaction = await ctx.db.query('interactions').collect()
    return { interaction }
  }),
)
export const get = customGet

//! why doesn't this export?
export const getInteractions = customGet({
  args: { test: z.string().optional() },
  handler: async ({ interaction }) => {
    return interaction
  },
})

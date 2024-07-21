import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const InteractionState = v.union(
  v.literal('started'),
  v.literal('completed'),
  v.literal('failed')
)

export const Interaction = v.object({
  content: v.optional(
    v.object({
      task: v.string(),
      choices: v.array(v.string()),
      isCorrect: v.array(v.boolean()),
    })
  ),
  state: v.optional(InteractionState),
})

export const Sequence = v.object({
  index: v.number(),
  interactionsIds: v.optional(v.array(v.id('interactions'))),
  prerequisites: v.array(v.string()),
  tagline: v.string(),
  title: v.string(),
})

const sequences = defineTable(Sequence)

const inferences = defineTable({
  sources: v.any(),
})

const interactions = defineTable(Interaction)

export default defineSchema({
  sequences,
  interactions,
  inferences,
})

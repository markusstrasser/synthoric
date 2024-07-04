import { Id } from './_generated/dataModel'
import { query, mutation, action, internalMutation, internalQuery } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'
import { z } from 'zod'
import jsyaml from 'js-yaml'
import { compressInteractionsforLLM, omit } from '../lib/utils'
import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomQuery, zCustomMutation, zid } from 'convex-helpers/server/zod'
import { UserActionSchema, SubmissionReviewSchema } from '../lib/schemas'
import { generateObject } from 'ai'
import {
  ContentGuidelinePrompt,
  ActionSelfTagPrompt,
  DebugPrompt,
  ApplicationExplainer,
} from '../lib/prompts'
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

const createInteractionPrompt = ({ interactions, inferences, seqId }) => {
  //TODO: filter interaction keys and summarize. use partition func
  const currentSequenceInteractions = compressInteractionsforLLM(
    interactions.filter(i => i.seqId === seqId).map(i => omit(['_id'], i))
  )
  const otherSequencesInteractions = compressInteractionsforLLM(
    interactions.filter(i => i.seqId !== seqId).map(i => omit(['_id'], i))
  )
  const infs = jsyaml.dump(omit(['_id', '_creationTime', 'sources'], inferences), {
    skipInvalid: true,
  })

  return `
  You are given the following history and user insights:
    1. 'interactions': the previous history of interactions the user engaged with within our App. This includes the actions taken within a dynamic UI component (key 'useractions'), often with additional information (timeElapsed etc.). for you to consider.
    2. 'inferences' : the previous inferences and learning insights another AI System made about the user ie. assumed/inferred knowledge, skills, abilities, etc.)

      <interactions>
      <from-current-learning-sequence>
      ${currentSequenceInteractions}
      </from-current-learning-sequence>

      <from-other-sequences>
      ${otherSequencesInteractions}
      </from-other-sequences>

      </interactions>

      <inferences>

      ${infs}
      </inferences>

`
}

//@ts-ignore
const generateNextInteraction = async ({ ctx, tagline, seqId }) => {
  const [interactions, inferences] = await Promise.all([
    ctx.db.query('interactions').collect(),
    ctx.db.query('inferences').collect(),
  ])

  //TODO: explain what a sequence is and the effort/time limit
  const OrchestratorPrompt = `
  ## Application Explainer
  ${ApplicationExplainer}
  
  Your task is to ** generate the next interaction that the user will see. **.

  ## Current Course Sequence
  The topic/tagline of the current learning Sequence is: 
  <LearningSequenceTopic>
  ${tagline}
  </LearningSequenceTopic>
  ## Context: User History and Inferences
  <Context>
  ${createInteractionPrompt({ interactions, inferences, seqId })}
  </Context>
  `

  const { object } = await generateObject({
    prompt: OrchestratorPrompt,
    schema: z.object({
      prompts: z.array(
        z.string().describe(
          `a specific LLM prompt for the next AI to use. The prompt has to detail the subtopic, what skill/concept should be tested and so on. 
        * Consult the previous student history to generate a fitting, personalized instruction (interactions and system inferences about the student). 
        * In the prompt, list any context (interactions, inferences) to best inform the tool AI and personalize the UI and interaction.`
        )
      ),
      interactionType: z.enum(['exercise', 'multipleChoice', 'binaryChoice']), //TODO: infer from interactionTypes schema ... or types..
      config: z.object({
        count: z
          .number()
          .min(1)
          .max(5)
          .describe('The number of consequtive interactions to generate'),
      }), //TODO: infer from interactionTypes schema ... or types..
    }),
    model: anthropic('sonnet'),
  })

  const { prompts, interactionType, config } = object

  const suffix = `
  Be careful to adhere to these principles:
  <ContentGuideLines>
  ${ContentGuidelinePrompt}
  </ContentGuideLines>
  `
  // const type2Action = {
  //   exercise: () => generateInteraction,
  //   multipleChoice: generateMultipleChoice,
  //   binaryChoice: generateMultipleChoice,
  // }

  prompts.map(p =>
    type2Action[interactionType](
      `${p} 
  ${suffix}
  `
    ).then(interaction => ctx.db.insert('interactions', interaction))
  )
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

export const create = zMutation({
  args: {
    //? don't use z.date
    seqIndex: z.number(),
    interactionIndex: z.number(),
    // content: z.any(),
    // index: z.number(),
  },
  handler: async (ctx, { seqIndex, interactionIndex }) => {
    const seq = await ctx.db
      .query('sequences')
      .filter(q => q.eq(q.field('index'), seqIndex))
      .first()

    const interaction = await generateNextInteraction({ ctx, ...seq })
    const interactionId = await ctx.db.insert('interactions', {
      ...interaction,
      seqIndex,
      interactionIndex,
    })

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

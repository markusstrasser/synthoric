import { v } from 'convex/values'
import generateNextInteractionSpec from '../lib/generateNextInteractionSpec'
import Tools from '../lib/tools'
import { api, internal } from './_generated/api'
import type { Id } from './_generated/dataModel'
import { internalAction } from './_generated/server'

export const create = internalAction({
  args: {
    seqIndex: v.number(),
    interactionIndex: v.number(),
    contextStr: v.string(),
    seq: v.any(),
  },

  handler: async (ctx, { seqIndex, interactionIndex, contextStr, seq }) => {
    const { MultipleChoiceTask, FreeFormTextInputTask } = Tools
    const availableTools = { MultipleChoiceTask, FreeFormTextInputTask } as const
    type ToolType = keyof typeof availableTools

    ctx.runMutation(api.cache.newStatus, {
      status: 'Interaction Generation: Generating Prompts & Spec',
    })
    const { prompts, interactionType } = (await generateNextInteractionSpec({
      contextStr,
      availableTools,
    })) as { prompts: string[]; interactionType: ToolType }

    const generateAndInsertInteraction = async (prompt: string, index: number) => {
      const interaction = await availableTools[interactionType]
        //@ts-ignore
        .execute(`${prompt}.\n${ContentGuidelinePrompt}`)
      const interactionId: Id<'interactions'> = await ctx.runMutation(
        internal.interactions.insertInteractionAndLinkToSequence,
        {
          content: interaction,
          seqIndex,
          interactionIndex: interactionIndex + index,
          seqId: seq._id,
        }
      )

      return interactionId
    }

    //TODO: make all interactionCreation run in parallel with while loop checking if resolved?
    const firstInteractionId = await generateAndInsertInteraction(prompts[0], 0)

    const remainingInteractionIds = await Promise.all(
      prompts.slice(1).map((prompt, index) => generateAndInsertInteraction(prompt, index + 1))
    )

    return {
      success: true,
      firstInteractionId,
      totalInteractions: prompts.length,
      allInteractionIds: [firstInteractionId, ...remainingInteractionIds],
    }
  },
})

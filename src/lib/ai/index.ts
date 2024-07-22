import { api } from '$convex/_generated/api'
import { convexClient } from '$lib/providers'
import createContextPrompt from '$lib/createContextPrompt'
import Tools from '$lib/tools'
import generateNextInteractionSpec from '$lib/generateNextInteractionSpec'
import { ContentGuidelinePrompt } from '$lib/prompts'

export const generateInteractionContent = async (seqIndex: number) => {
  const context = await convexClient.query(api.interactions.getContext, {
    seqIndex,
  })

  const { interactions, inferences, seq } = context

  const contextStr = createContextPrompt({
    interactions,
    inferences,
    seqIndex,
    tagline: seq?.tagline,
  })

  const { MultipleChoiceTask, FreeFormTextInputTask } = Tools
  const availableTools = { MultipleChoiceTask, FreeFormTextInputTask } as const
  type ToolType = keyof typeof availableTools

  const { prompts, interactionType } = (await generateNextInteractionSpec({
    contextStr,
    availableTools,
  })) as { prompts: string[]; interactionType: ToolType }

  let nextInteractionContent = null
  // let allInteractions = []

  for (const [index, prompt] of prompts.entries()) {
    //@ts-ignore
    const interaction = await availableTools[interactionType].execute(
      `${prompt}.\n${ContentGuidelinePrompt}`
    )
    // allInteractions.push(interaction)

    if (index === 0) {
      nextInteractionContent = interaction
    }
  }

  return {
    content: nextInteractionContent,
  }
}

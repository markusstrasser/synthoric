import { json, type RequestHandler } from '@sveltejs/kit'
import { api } from '$convex/_generated/api.js'
import { convexClient } from '$lib/providers'
import formatContextPrompt from '$lib/formatContextPrompt'
import Tools from '$lib/tools'
import generateNextInteractionSpec from '$lib/generateNextInteractionSpec'
import { ContentGuidelinePrompt } from '$lib/prompts'
import { updateStatus } from '$utils/index'

const interactionExamples = [
  {
    id: '123',
    tagline: 'Classical mechanics exercise',
    content: [{ question: 'Calculate the trajectory of a projectile...' }],
  },
]
const generateNextInteraction = async (seqIndex: number) => {
  updateStatus('Gathering Context')
  console.log('seqIndex', seqIndex)
  const context = await convexClient.query(api.interactions.getContext, {
    seqIndex,
  })
  const contextStr = formatContextPrompt(context)
  console.log(contextStr, 'CONTEXTSTR')

  //? right now fetches entire tables from the Database
  const { sequence } = context

  const { MultipleChoiceTask, FreeFormTextInputTask } = Tools
  const availableTools = { MultipleChoiceTask, FreeFormTextInputTask } as const
  type ToolType = keyof typeof availableTools

  updateStatus('Generating Interaction Spec')
  const { prompts, interactionType } = (await generateNextInteractionSpec({
    contextStr,
    availableTools,
  })) as { prompts: string[]; interactionType: ToolType }

  let nextInteractionContent = null
  //TODO: make all interactionCreation run in parallel with while loop checking if resolved?
  for (const [index, prompt] of prompts.entries()) {
    updateStatus(`Generating Interaction ${index} of ${prompts.length} with prompt: ${prompt}`)
    //@ts-ignore
    const toolChoice = availableTools[interactionType]
    console.log(`Generating ${toolChoice.description}`)

    const interaction = await toolChoice.execute(`${prompt}.\n${ContentGuidelinePrompt}`)
    if (index === 0) {
      nextInteractionContent = interaction
    }

    //? adds interaction to .interactions and id to seq.interactions[...id]
    const interactionId = await convexClient.mutation(
      api.interactions.insertInteractionAndLinkToSequence,
      {
        interactionContent: interaction,
        seqId: sequence._id,
      }
    )
    console.log('interactionId', interactionId)
  }

  updateStatus('Completed Generating Interactions')
  return nextInteractionContent
}

export const POST: RequestHandler = async ({ request }) => {
  const { sequenceIndex } = await request.json()

  if (typeof sequenceIndex !== 'number') {
    return json(
      { success: false, error: 'Invalid sequenceIndex or interactionIndex' },
      { status: 400 }
    )
  }

  try {
    const nextInteraction = await generateNextInteraction(sequenceIndex)
    return json(nextInteraction)
  } catch (error) {
    console.error('Error generating next interaction:', error)
    return json({ success: false, error: 'Failed to generate next interaction' }, { status: 500 })
  }
}

import { json, type RequestHandler } from '@sveltejs/kit'
import { api } from '$convex/_generated/api.js'
import { convexClient } from '$lib/providers'
import createContextPrompt from '$lib/createContextPrompt'
import Tools from '$lib/tools'
import generateNextInteractionSpec from '$lib/generateNextInteractionSpec'
import { ContentGuidelinePrompt } from '$lib/prompts'

const interactionExamples = [
  {
    id: '123',
    tagline: 'Classical mechanics exercise',
    content: [{ question: 'Calculate the trajectory of a projectile...' }],
  },
]
// console.log(await convexClient.query(api.interactions.getAll))

const updateStatus = async (status: string) => {
  await convexClient.mutation(api.cache.newStatus, {
    status,
  })
}

const generateNextInteraction = async (seqIndex: number, interactionIndex: number) => {
  updateStatus('Gathering Context')
  console.log('seqIndex', seqIndex)
  console.log('interactionIndex', interactionIndex)
  const context = await convexClient.query(api.interactions.getContext, {
    seqIndex,
  })

  //? right now fetches entire tables from the Database
  const { interactions, inferences, seq } = context

  const contextStr = createContextPrompt({
    interactions,
    inferences,
    seqIndex,
    tagline: seq.tagline,
  })
  console.log(contextStr, 'contextPrompt')

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
    const interaction = await availableTools[interactionType].execute(
      `${prompt}.\n${ContentGuidelinePrompt}`
    )
    if (index === 0) {
      nextInteractionContent = interaction
    }

    //? adds interaction to .interactions and id to seq.interactions[...id]
    await convexClient.mutation(api.interactions.insertInteractionAndLinkToSequence, {
      interactionContent: interaction,
      seqId: seq._id,
    })
  }

  updateStatus('Completed Generating Interactions')
  return nextInteractionContent
}

export const POST: RequestHandler = async ({ request }) => {
  const { sequenceIndex, interactionIndex } = await request.json()

  if (typeof sequenceIndex !== 'number' || typeof interactionIndex !== 'number') {
    return json(
      { success: false, error: 'Invalid sequenceIndex or interactionIndex' },
      { status: 400 }
    )
  }

  try {
    const nextInteraction = await generateNextInteraction(sequenceIndex, interactionIndex)
    return json(nextInteraction)
  } catch (error) {
    console.error('Error generating next interaction:', error)
    return json({ success: false, error: 'Failed to generate next interaction' }, { status: 500 })
  }
}

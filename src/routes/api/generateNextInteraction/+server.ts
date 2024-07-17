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
    interactionIndex,
  })

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

  const generateAndInsertInteraction = async (prompt: string, index: number) => {
    updateStatus(`Generating Interaction ${index} with prompt: ${prompt}`)
    const interaction = await availableTools[interactionType]
      //@ts-ignore
      .execute(`${prompt}.\n${ContentGuidelinePrompt}`)

    updateStatus(`Interaction Generation: Generating Interaction ${index} of ${prompts.length}`)

    const interactionId = await convexClient.mutation(
      api.interactions.insertInteractionAndLinkToSequence,
      {
        content: interaction,
        seqIndex,
        interactionIndex: interactionIndex + index,
        seqId: seq._id,
      }
    )
    return { interaction, interactionId }
  }

  //TODO: make all interactionCreation run in parallel with while loop checking if resolved?

  const { interaction, interactionId } = await generateAndInsertInteraction(prompts[0], 0)
  // await Promise.all(
  //   prompts.slice(1).map((prompt, index) => generateAndInsertInteraction(prompt, index + 1))
  // )

  updateStatus('...')
  return {
    interaction,
    interactionId,
    // firstInteractionId,
    totalInteractions: prompts.length,
    // allInteractionIds: [firstInteractionId, ...remainingInteractionIds],
  }
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
    const res = await generateNextInteraction(sequenceIndex, interactionIndex)
    return json({ success: true, data: res })
  } catch (error) {
    console.error('Error generating next interaction:', error)
    return json({ success: false, error: 'Failed to generate next interaction' }, { status: 500 })
  }
}

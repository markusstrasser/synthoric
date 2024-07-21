import { api } from '$convex/_generated/api.js'
import { ApplicationExplainer } from '$lib/prompts'
import Tools from '$lib/tools'

const generateSequence = async () => {
  console.log('Generating new sequence')

  const { SequencePreview } = Tools
  const prompt = `
  
  ${ApplicationExplainer}
    The user is currently on the home screen and chosing between for new course sequences to learn.
    The user is displayed card previews for each possible next sequence.
  
    ${SequencePreview.prompt}
    
    `

  //@ts-ignore
  const content = await SequencePreview.execute(prompt)

  return [content]
}

export const actions = {
  default: async ({ locals }) => {
    try {
      const newSequences = await generateSequence()

      await Promise.all(
        newSequences.map(seq => {
          seq = { ...seq, interactionsIds: [] }

          return locals.convexClient.mutation(api.sequences.create, { sequence: seq })
        })
      )
    } catch (error) {
      console.error('Failed to generate sequences:', error)

      return {
        error: 'Failed to generate sequences',
      }
    }
  },
}

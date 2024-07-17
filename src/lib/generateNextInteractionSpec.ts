import { ApplicationExplainer } from '../lib/prompts'

import { generateObject } from 'ai'
import { z } from 'zod'
import { anthropic } from './providers'

//@ts-ignore
const generateNextInteractionSpec = async ({ contextStr, availableTools }) => {
  const names = Object.keys(availableTools)
  //TODO: explain what a sequence is and the effort/time limit
  const OrchestratorPrompt = `
  ## Application Explainer
  ${ApplicationExplainer}
  
  Your task is to ** generate a high level configuration for the next interaction that the user will see. **.

  <availableInteractionTypes>
  ${JSON.stringify(
    Object.entries(availableTools).map(([name, tool]) => ({
      //@ts-ignore
      name: tool.description,
    }))
  )}
  </availableInteractionTypes>
  ${availableTools}

  ${contextStr}
  `
  // const names = Object.keys(availableTools) ]

  const { object } = await generateObject({
    prompt: OrchestratorPrompt,
    schema: z.object({
      interactionType: z.enum(names as [string, ...string[]]), //TODO: infer from interactionTypes schema ... or types..
      prompts: z
        .array(
          //TODO: could be params?
          z.string().describe(
            `a specific LLM prompt for the next AI to use. The prompt has to detail the subtopic, what skill/concept should be tested and so on. 
        * Consult the previous student history to generate a fitting, personalized instruction (interactions and system inferences about the student). 
        * In the prompt, list any context (interactions, inferences) to best inform the tool AI so it can personalize UI and interaction.`
          )
        )
        .max(1),
      // runConfig: z.object({
      //   count: z
      //     .number()
      //     .min(1)
      //     .max(5)
      //     .describe('The number of consequtive interactions to generate'),
      // }), //TODO: infer from interactionTypes schema ... or types..
    }),
    model: anthropic('claude-3-5-sonnet-20240620'),
  })
  return object
}
export default generateNextInteractionSpec

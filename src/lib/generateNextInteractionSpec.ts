import { ApplicationExplainer } from '../lib/prompts'

import { generateObject } from 'ai'
import { z } from 'zod'
import { anthropic, groq } from './providers'

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

  Consult the previous CONTEXT to generate a fitting, personalized instruction.
  ${contextStr}
  
  * You do not have to include the tool description and so on. 
  The tool has it's own prompt that describes it's type. But you have the context and user history – the tool has no context of the previous interactions or user actions.
  >> Avoid duplicates and repetition unless if you think the student should be re-exposed to it.
  Every prompt can include:
  * what skill/concept to test the user on. 
  * mentions of user history (context) to best inform the tool AI so it can personalize UI and content.
  
  
  Here's an example output with placeholders {} for the context you can insert:
  <example outputs>
  * Test the user on the relationship between centripedal force and velocity in circular motion. The task should challenge the user to think about how changing the velocity would affect the centripetal force required to maintain circular motion, both in the case of a roller coaster loop and a satellite orbit. The user previously correctly completed: {...insertRelevantTasks}. The user struggled with {...insertWhatYouThinkAreStrugglepoints}

  * Building on the user's correct understanding of how velocity affects centripetal force, challenge them to apply this knowledge to a real-world scenario. Present a situation where a space agency needs to adjust a satellite's orbit to a higher altitude while maintaining a circular path. Ask the user to explain the steps the agency would need to take in terms of adjusting the satellite's velocity, and how this relates to the centripetal force required for the new orbit. Encourage them to think about the balance between gravitational pull and the satellite's velocity in maintaining a stable, circular orbit at different altitudes.
  </example outputs>
  `

  const { object } = await generateObject({
    prompt: OrchestratorPrompt,
    schema: z.object({
      interactionType: z.enum(names as [string, ...string[]]), //TODO: infer from interactionTypes schema ... or types..
      //TODO: could be params?
      prompts: z
        .array(
          z
            .string()
            .describe('A specific LLM prompt that will be fed to the tool AI to make sense of')
        )
        .max(3),
    }),
    model: anthropic('claude-3-5-sonnet-20241022'),
  })
  return object
}
export default generateNextInteractionSpec

import { z } from 'zod'
import { ApplicationExplainer } from '$prompts'

const mockContext = `
* The current topic is classical mechanics.
* The user is a high school AP or college freshman.
* The user likes elegant styling
`

const WhatYouCanDoPrompt = `
In general you can create any interface you want. 
You also have access to
* lots of components (ala component library)
* utility libraries
* drawing (2D and 3D like D3js, p5)

This is to open up your mind to find the most engaging and fitting next interface to think off for the user.
Obviously content/concepts and context should win over just a cool interface but I hope can raise it to an art form.  
`

export const InteractionSpecExampleOutputs = `
Here's an example output with placeholders {} for the context you can insert:
  <example outputs>
    * Test the user on the relationship between centripedal force and velocity in circular motion. The task should challenge the user to think about how changing the velocity would affect the centripetal force required to maintain circular motion, both in the case of a roller coaster loop and a satellite orbit. The user previously correctly completed: {...insertRelevantTasks}. The user struggled with {...insertWhatYouThinkAreStrugglepoints}

    * Building on the user's correct understanding of how velocity affects centripetal force, challenge them to apply this knowledge to a real-world scenario. Present a situation where a space agency needs to adjust a satellite's orbit to a higher altitude while maintaining a circular path. Ask the user to explain the steps the agency would need to take in terms of adjusting the satellite's velocity, and how this relates to the centripetal force required for the new orbit. Encourage them to think about the balance between gravitational pull and the satellite's velocity in maintaining a stable, circular orbit at different altitudes.
  </example outputs>`

const InteractionSpecPrompt = `${ApplicationExplainer}
 Your task is to ** generate a high level configuration prompt for the next interaction to show to the user**.
This specification will be fed to the next AI that then transforms it into actual frontend component markup, data and code. 
You do not need to generate any code. That's the task of your successor AI 
You will be provided with CONTEXT (user analytics, topic, interaction- and app history) to make the most engaging interaction for the user.

The AI that reads your specification has no access to the user data Context you are provided with. This means you should mention any important details, concepts, representations, analytics, insights and so on. You can recommend a few ideas or  or issues the user might have. 

Every prompt should include:
  * what skill/concept to test the user on. 
  * mentions of relevant context to best inform the tool AI so it can personalize UI and content.
  * what the UI should do and how the interface should look like

${WhatYouCanDoPrompt}

Avoid duplicates and repetition unless if you think the student should be re-exposed to it.

`
export default {
  //execute is passed into the .execute function
  description: 'Creates the High Level Specification for the next Interaction: content and UI',
  prompt: InteractionSpecPrompt,
  // prefill: dynamicComponentStarterMarkup,
  // params: z.any(),
  schema: z.object({
    specficationPrompt: z.string(),
    debug: z.string().describe('explain your choices'),
  }),
}

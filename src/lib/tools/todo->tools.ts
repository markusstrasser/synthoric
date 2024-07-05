'use server'
import { generateObject } from 'ai'
import { z } from 'zod'
import { openai } from '$lib/providers'
import * as s from '$schemas'

// const ToolDispatch = async tools => {
//   const topic = 'physics'
//   const context = getContext()
//   const { object } = await generateObject({
//     prompt: `${ApplicationGoalTemplate}
//     ----
//     Your job now is to decide on the best next interaction type [toolcall] to serve to the student.

//     The general topic is ${topic}
//     ${Handlebars.compile(ContextExplainerTemplate)(context)}

//     """Avaiable Tools that will be presented as UI to the user""":
//     ${tools.map(t => t.description)}

//     If the tool parameters have a 'prompt' field:
//     * you must generate a specific prompt for the next AI to use. The prompt has to detail the subtopic, what skill/concept should be tested and so on. Consult the previous student history to generate a fitting, personalized instruction (interactions and system inferences about the student).
//     * In the prompt, also list any context (interactions, inferences) to best inform the tool AI.
//     ----
//     `,
//     schema: z.object({
//       tool: z.enum(Object.keys(tools) as [string, ...string[]]),
//       prompt: z.string(),
//     }),
//     model: openai('gpt-4o'),
//   })
//   return object
// }

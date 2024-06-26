'use server'
import { generateObject } from 'ai'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { EventEmitter } from 'node:events'
import { InferencePrompt } from '@/lib/prompts/static'
import { ApplicationGoalTemplate, ContextExplainerTemplate } from '@/lib/prompts/snippets'
import { InferenceSchema } from '@/lib/zodSchemas/'
import { YAMLify } from '@/lib/utils'
import Handlebars from 'handlebars'
import { SubmissionReviewSchema } from '@/lib/zodSchemas'
import { getContext } from '@/lib/utils'
import * as dotenv from 'dotenv'
import { createOpenAI } from '@ai-sdk/openai'

dotenv.config()

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

const emitter = new EventEmitter()

emitter.on('update:UserAction', userAction => {
  logger.info('update:UserAction', userAction)
})
emitter.on('generateElement', ({ typeKey }) => {
  logger.info(`generateElement: ${typeKey}`)
})
emitter.on('generateInferences', inferences => {
  logger.info(`generateInferences: ${inferences}`)
})

const mock = false

//? runs after any interaction. Make sure to AWAIT the DB update in client
export const generateInferences = async config => {
  //TODO: maybe use getsince?
  //TODO: get interactions since last update (this should've been just before the call to this function)
  const CONTEXT = await getContext()
  //2 run inference prompt
  console.log('generating inferences now', CONTEXT)
  const { object } = await generateObject({
    prompt: `${ApplicationGoalTemplate}
    ** You will be given Context from userdata with which you have to produce Inferences about the user's knowledge/skills [instructions follow]. If the information is not relevant or meaningless, just return an empty array. 
    Focus on the most recent interactions, especially within the interaction sequence (seqId). The current time is ${new Date()}
    **
    ${Handlebars.compile(ContextExplainerTemplate)(CONTEXT)}
    ${InferencePrompt}`,
    model: openai('gpt-4o'),
    schema: z.object({ content: z.array(InferenceSchema) }),
  })

  const inferences = object.content
  //@ts-ignore
  console.log('generated inferences: result', inferences)
  emitter.emit('generateInferences. Result:', inferences)
  return inferences
  //3 -> DB create inference
  //4 return inference
}

export const generateSubmissionReview = async interaction => {
  const prompt = `The following is a task/exercise the user just completed. You're given the solution, the actions the user took (including the final input).
    Please evaluate the user's submission and rate it.
    Give short, targeted, technical feedback.
    * If the student forgets to give the right physical units (ie. 100 instead of 100 m/s) iff it was obvious from the task text and you can assume it's just an oversight, not a conceptual misunderstanding you can give benefit of a doubt (full rating credit) BUT mention it inside the review.
    * If the student gets the right answer but wrong units (100m/s instead of 100m for example), it's wrong (1), but it seems he did the calculation correct. You can mention that

    The INTERACTION:::
    ${YAMLify(interaction)}
    :::
    `
  const { object } = await generateObject({
    prompt,
    model: openai('gpt-4o'),
    schema: SubmissionReviewSchema,
  })
  console.log('Submission Review::', object)
  return object
}

// export const gen = async (config) => {
//   "use server";

//   //TODO: validate that dependencies are in parent func...
//   const { prompt, schema, example } = config;
//   let response;

//   if (mock) {
//     response = example;
//   } else if (!prompt) {
//     response = "...";
//   } else {
//     const { object } = await generateObject({
//       prompt,
//       model: openai("gpt-4o"),
//       schema: z
//         .object({ content: schema })
//         .describe(
//           "Your response MUST be valid json without bad control characters because it will be parsed into an JS Object in the frontend. "
//         ),
//     });
//     response = object.content;
//   }

//   return response;
// };

import { z } from 'zod'
import { MarkdownFormattingPrompt } from '../prompts/static'
import {
  ApplicationGoalTemplate,
  ContextExplainerTemplate,
  ContentGuidelinePrompt,
  SelfTagPrompt,
} from '../prompts/snippets'
import Handlebars from 'handlebars'

export const TaskTemplate: string = `
${ApplicationGoalTemplate} 

**Your job is to generate the next Task for the user**

${ContextExplainerTemplate}

NEVER mention the information from the "useractions" subfield to the User as it is just for your decision making. It will be hidden in the UI and the user won't see it.

IFF 'interactions' or 'inferences' are empty, just  use the topic as a starting point but preface your response with "Since I know little about you, let's start with the following:"

${ContentGuidelinePrompt}

Also, ${SelfTagPrompt}
:=> Now, create a Task for the user :`

const _templateOutdated = ({ interactions, inferences }) =>
  Handlebars.compile(TaskTemplate)({ interactions, inferences })

export default function task(prompt: string) {
  return {
    type: 'task',
    description:
      'Use when you want to display a task or the next exercise to the user',
    prompt,
    schema: z
      .string()
      .describe(`${MarkdownFormattingPrompt}. Should be under 30 words`),
    example:
      'A car of mass 1200 kg is traveling at a constant speed of 20 m/sec. It suddenly applies brakes and comes to a stop in 10 seconds. What is the force exerted by the brakes on the car? ',
  }
}

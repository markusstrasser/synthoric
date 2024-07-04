'use server'
import { ApplicationGoalTemplate, ContextExplainerTemplate } from '@/lib/prompts/snippets'
import { getContext } from '@/lib/utils'

import { generateObject } from 'ai'
import { z } from 'zod'
import Handlebars from 'handlebars'
import { openai } from '@/lib/providers'
import { task, multipleChoice, solution } from '@/lib/tools/index'

const generateTextInputTask = async (prompt: string) => {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    prompt,
    schema: z.object({ content: task.schema }),
  })
  return object.content
}

const generateMultipleChoice = async (prompt: string) => {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    prompt,
    schema: z.object({ content: multipleChoice.schema }),
  })
  return object.content
}

const generateTextInputSolution = async (task: any) => {
  const { object } = await generateObject({
    model: openai('gpt-4o'),
    prompt: solution.promptTemplate({ task }),
    schema: z.object({ content: solution.schema }),
  })
  return object.content
}

const batchGenerateInteractions = async () => {
  //TODO: this is for when we generate multiple interactions in one LLM call and post them to the DB
  return null
}

const generateNextInteraction = async () => {
  const { tool, prompt } = await ToolDispatch({ task, multipleChoice })

  if (tool === 'ExerciseWithTextInput') {
    const task = await generateTextInputTask(prompt)
    const solution = await generateTextInputSolution(task)
    return {
      type: 'ExerciseWithTextInput',
      task,
      solution,
    }
  }

  if (tool === 'MultipleChoice') {
    const mc = await generateMultipleChoice(prompt)
    return {
      type: 'MultipleChoice',
      mc,
    }
  }

  return 'no tool match'
}

const ToolDispatch = async tools => {
  const topic = 'physics'
  const context = getContext()
  const { object } = await generateObject({
    prompt: `${ApplicationGoalTemplate}
    ----
    Your job now is to decide on the best next interaction type [toolcall] to serve to the student. 
    
    The general topic is ${topic} 
    ${Handlebars.compile(ContextExplainerTemplate)(context)}
    
    """Avaiable Tools that will be presented as UI to the user""":
    ${tools.map(t => t.description)}

    If the tool parameters have a 'prompt' field: 
    * you must generate a specific prompt for the next AI to use. The prompt has to detail the subtopic, what skill/concept should be tested and so on. Consult the previous student history to generate a fitting, personalized instruction (interactions and system inferences about the student). 
    * In the prompt, also list any context (interactions, inferences) to best inform the tool AI.
    ----
    `,
    schema: z.object({
      tool: z.enum(Object.keys(tools) as [string, ...string[]]),
      prompt: z.string(),
    }),
    model: openai('gpt-4o'),
  })
  return object
}

import {
  ApplicationGoalTemplate,
  ContextExplainerTemplate,
} from '@/lib/prompts/snippets'
import { multipleChoice, task, solution } from '@/lib/tools'
import { getContext } from '@/lib/utils'
import { openai } from '@/lib/providers'
import { z } from 'zod'
import { generateObject } from 'ai'

export const generateTextInputExercises = async ({ count = 1 }) => {
  //TODO:
  const { interactions, inferences } = await getContext()
  //1. generate Task
  const { object } = await generateObject({
    prompt: task.promptTemplate({
      interactions,
      inferences,
    }),
    model: openai('gpt-4o'),
    schema: z.object({
      content: z.array(task.schema).min(count).max(count),
    }),
  })
  const tasks = object.content

  //2. generate Solution
  const solutions = await Promise.all(
    tasks.map(async (task) => {
      const { object } = await generateObject({
        //! handlbars is a bad solution since it's untyped and unclear what property goes into the template
        prompt: solution.promptTemplate({ task }),
        schema: z.object({ content: solution.schema }),
        model: openai('gpt-4o'),
      })
      return object.content
    }),
  )
  const exercises = tasks.map((task, i) => ({ task, solution: solutions[i] }))
  return exercises
}

export const generateMultipleChoiceTasks = async ({
  count = 2,
  numChoices = 2,
}) => {
  const configuration = {
    hasImmediateFeedback: false,
  }

  const CONTEXT = await getContext() //TODO: add config {lastK, ixTypes, onlyWithinSeq?}
  //? const { interactions, inferences, currentTopic } = CONTEXT;
  //2 run inference prompt
  console.log('generating inferences now', CONTEXT)
  const { object } = await generateObject({
    prompt: `${Handlebars.compile(ApplicationGoalTemplate)({
      topic: 'physics',
    })}
    Generate ${count} multiple choice tasks with each ${numChoices} possible answers.
    ${Handlebars.compile(ContextExplainerTemplate)(CONTEXT)}`,
    model: openai('gpt-4o'),
    schema: z.object({
      content: z.array(multipleChoice.schema).min(count).max(count),
    }),
  })
  return object.content
}

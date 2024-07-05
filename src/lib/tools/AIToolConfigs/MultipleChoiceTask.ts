import { z } from 'zod'

export default {
  description: 'A multiple choice question with a list of options',
  params: z.object({ numChoices: z.number().min(2) }),
  prompt: 'Create a multiple choice task',
  schema: z.object({
    task: z.string(),
    choices: z.array(z.string()).min(2),
    isCorrect: z.array(z.boolean()).min(2),
  }),
} as const

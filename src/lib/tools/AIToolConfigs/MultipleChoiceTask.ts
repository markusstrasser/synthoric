import { z } from 'zod'

export default {
  description: `A multiple choice question with a list of options.
  <When-to-use>
  Use for quick review or when the user domain knowledge mastery or systemConfidence is still uncertain 
  </When-to-use>
  `,
  // params: z.object({ numChoices: z.number().min(2) }),
  prompt: `Create a multiple choice task.
  * Each choice should hint at different knowledge gaps of the user: Have smart answer choices that include the correct answer, an almost correct answer, a wrong answer and a totally wrong answer. This is to give the user learning system more insight of the user knowledge.
  * Try to minimize the time it takes the user to read through the choices, since that's overhead if the user knows the answer but needs to read through all options to find it
  `,
  schema: z.object({
    task: z.string(),
    choices: z.array(z.string()).min(2),
    isCorrect: z.array(z.boolean()).min(2),
  }),
} as const

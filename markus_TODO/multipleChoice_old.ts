import { z } from 'zod'

//TODO: what if the schema has dynamic variables?
export default {
  name: 'MultipleChoice',
  description:
    'Use when you want to display a multiple choice question to the user',
  type: 'INPUT',
  schema: z.object({
    //TODO: add time-effort / difficulty level
    task: z.string().describe('The questions/task shown to the student'),
    choices: z.array(z.string()).min(2),
    isCorrect: z
      .array(z.boolean())
      .min(2)
      .describe(
        'Only one of the choices should be correct. All others must be false',
      ),
  }),
}

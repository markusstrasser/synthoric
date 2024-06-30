import { z } from 'zod'

export const hintPrompt: string = `
Create 0-2 hints that help the student discover the solution or rethink their approach for the following Task:
`

export default {
  name: 'HINTS',
  toolContext:
    'Use when you want to display a task or the next exercise to the user',
  prompt: hintPrompt,
  schema: z
    .array(
      z.object({
        //TODO: maybe generalize/combine this with Guidance in general
        type: z
          .string()
          .describe(
            'Something like Formula, Concept, Procedure, MetaStrategy or other which we can signify to the user before he choses to reveal the hint',
          ),
        content: z.string().describe('Short hint under 15 words'),
        strength: z
          .number()
          .min(1)
          .max(5)
          .describe('1 for most subtle, 5 for almost revealing the solution'),
        //trigger: z.enum(["OnDemand", "OnTimeElapsed", "OnMistake"]),
      }),
    )
    .max(2),
  example: [
    {
      type: 'Conceptual',
      content:
        'Remember, force can be calculated using the formula F = m × a, where F is force, m is mass and a is acceleration.',
      strength: 1,
    },
    {
      type: 'Procedural',
      content:
        'In this case, you need to determine the acceleration first. Acceleration is the change in velocity divided by the time taken for the change. Here, initial velocity is 20 m/sec and final velocity is 0 m/sec with the change in time being 10 seconds.',
      strength: 2,
    },
  ],
}

import { z } from 'zod'

export default {
  description: 'Generate an informative review of the user submission/interaction for remediation',
  prompt: `The following is a task/exercise the user just completed. You're given the solution, the actions the user took (including the final input).
    Please evaluate the user's submission and rate it.
    Give short, targeted, technical feedback.
    * If the student forgets to give the right physical units (ie. 100 instead of 100 m/s) iff it was obvious from the task text and you can assume it's just an oversight, not a conceptual misunderstanding you can give benefit of a doubt (full rating credit) BUT mention it inside the review.
    * If the student gets the right answer but wrong units (100m/s instead of 1000m for example), it's wrong (1), but it seems he did the calculation correct. You can mention that
    `,
  params: z.object({
    interaction: z.any(),
  }),
  schema: z
    .object({
      feedback: z
        .string()
        .describe(
          "Quick precise feedback if user submission isn't 100% correct - under 20 words if possible. Remember the student sees the full solution in the UI with this feedback. Give feedback on things/misconceptions not apparent from the solution and taking his/her submission into account. If it's correct (highest rating), just reply: 'correct!'"
        ),
      // notes: z
      //   .string()
      //   .describe(
      //     "Iff the user's answer is wrong: short pointer to what misconception generally lead to that error, best if you can specifically point towards a repeting error the user makes (consulting history/context)"
      //   ),
      rating: z
        .number()
        .min(0)
        .max(3)
        .describe(
          `A number between 0 and 3. 
          * 0 for being absolutely wrong (even wrong units), 
          * 1 for being wrong, 
          * 2 for being partially correct or the right direction, 
          * 3 for the correct answer`
        ),
    })
    .describe("A review of the user's submission"),
}

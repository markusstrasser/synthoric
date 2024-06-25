import { z } from 'zod'

export const solutionSchema = z
  .object({
    highLevelSketch: z
      .string()
      .describe(
        'A concise overview of the key steps and strategies needed to solve the problem. ' +
          "This should provide a bird's eye view of the solution approach without going into too much detail.",
      ),
    // conceptualExplanation: z
    //   .string()
    //   .describe(
    //     "A clear explanation of the fundamental concepts, principles, and techniques that are relevant to solving this problem. " +
    //       "This should help the user understand the underlying ideas and theory behind the solution.",
    //   ),
    stepsNested: z
      .array(
        z.object({
          step: z
            .string()
            .describe(
              'A high-level step or phase in the overall solution process.',
            ),
          subSteps: z.array(
            z.object({
              title: z
                .string()
                .describe(
                  'A specific sub-step, calculation, or detail that falls under the corresponding high-level step. ' +
                    'This helps break down each main step into more manageable and understandable pieces.',
                ),
            }),
          ),
        }),
      )
      .describe(
        'A nested structure that concisely outlines the step-by-step solution process.  ' +
          'The outer level represents the main phases or milestones, while the inner level represents the more granular sub-steps or calculations within each phase. ' +
          'This should provide a clear roadmap for solving the problem from start to finish. Avoid repetition.',
      ),
    // commonMisconceptions: z
    //   .array(z.string())
    //   .describe(
    //     "A list of common misconceptions, pitfalls, or errors that students often encounter when trying to solve this type of problem. " +
    //       "Highlighting these can help the user avoid making the same mistakes and deepen their understanding.",
    //   ),
    /*   didUserMaster: z.boolean().describe(
    "An overall assessment of whether the user has demonstrated mastery of the concepts and techniques needed to solve this problem based on their submitted work. " +
    "This should take into account the accuracy and completeness of their solution, as well as any key insights or explanations they provided."  
  ),
  whatUserMissed: z.array(z.string()).describe(
    "A list of specific things the user missed, glossed over, or got wrong in their submission. " +
    "This targeted feedback helps the user see exactly where their understanding or execution fell short so they can focus their studying and improvement efforts."
  ),
  improvementTips: z.array(z.string()).describe(
    "Constructive and actionable suggestions for how the user can improve their understanding and performance on similar problems in the future. " +
    "This can include advice on problem solving strategies, pointing to relevant resources for further study, and tips for avoiding common mistakes. " +
    "The goal is to provide the user with a clear path forward for mastering this type of problem."
  ) */
  })
  .describe(
    'All strings and content is rendered inside a github flavored markdown component that has rehypeKatex enabled for latex expressions. When using math formulas in your content use the appropriate formatting',
  )

export default {
  type: 'SOLUTION',
  toolContext:
    'Use when you want to display a task or the next exercise to the user',
  promptTemplate: ({ task }: { task: string }) => `You are responding with a solution and review for the following Exercise or Task:
  ${task}
  `,
  schema: solutionSchema,
  example: {
    highLevelSketch:
      "The highest point the ball will reach is determined by the time it takes for the gravitational force to slow the ball's upward velocity to zero. In other words, we need to find the time when the ball's velocity is zero. We can then use this time to calculate the distance the ball has traveled upward from its starting height.",
    stepsNested: [
      {
        step: 'Step 1: Find the time it takes for the ball to stop rising',
        subSteps: [
          {
            title:
              'Use the formula for acceleration to find the time. The acceleration is equal to the change in velocity over time, so we get the equation: 0 = 10 m/s - g*t. Solving for t gives us: g*t = 10 m/s, so t = (10 m/s) / g.',
          },
        ],
      },
      {
        step: 'Step 2: Find the distance the ball travels upwards given this time',
        subSteps: [
          {
            title:
              'We use the formula for distance covered by an object moving with uniform acceleration. Since the initial velocity (u) is 10 m/s, acceleration (a) is -g and time (t) is what we calculated in the previous step, we can solve for distance (d) = ut + 0.5*a*t².',
          },
        ],
      },
      {
        step: 'Step 3: Add the original height of the ball',
        subSteps: [
          {
            title:
              'Finally, we add the height from which the ball was thrown to the distance we previously calculated.',
          },
        ],
      },
    ],
  },
}

//TODO: add mocks

const mockExercise = {
  content: {
    task: { content: 'Square a circle' },
    solution: {
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
  },
}

const mockMulitpleChoice = {
  content: {
    task: 'What is the capital of France?',
    choices: ['Paris', 'Berlin', 'Madrid', 'Rome'],
    isCorrect: [true, false, false, false],
  },
}

const mocks = [mockExercise, mockMulitpleChoice]

export const interactionMock = async () =>
  await new Promise(resolve =>
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mocks.length)
      resolve(mocks[randomIndex])
    }, 1000)
  )

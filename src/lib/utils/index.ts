import * as jsyaml from 'js-yaml'
import type { z } from 'zod'
import moment from 'moment'
import type { UserAction } from '$lib/types'

export const formatRelativeTimeAgo = (timeStamp: number): string => moment(timeStamp).fromNow()

export const isObjectEmpty = (obj: Record<string, unknown>): boolean =>
  Object.keys(obj).length === 0

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

//@ts-ignore
export const omit = (keys: string[], obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))

//@ts-ignore
export const summarizeInteraction = ({ content, userActions = [], firstSeen }) => {
  if (!userActions.find(action => action.hasSubmitted)) {
    //? unfinished interactions don't count
    return {}
  }
  const RelativefirstSeen = formatRelativeTimeAgo(firstSeen)
  return {
    //TODO: make more robust for non-task
    task: content.task,
    userInputs: userActions.map(({ type, value, timeStamp }) => {
      const timeInSeconds = (timeStamp - firstSeen) / 1000
      return value === 'submit'
        ? {
            type,
            timeUntilSubmitInSeconds: timeInSeconds,
          }
        : {
            type,
            ...(typeof value === 'object' && value !== null ? value : { value }),
            timeUntilActionInSeconds: (timeStamp - firstSeen) / 1000,
          }
    }),
    taskFirstSeen: RelativefirstSeen,
  }
}

export const schema2dict = (zodSchema: z.ZodObject<z.ZodRawShape>) =>
  Object.fromEntries(
    Object.entries(zodSchema.shape).map(([key, value]) => [
      key,
      (value as z.ZodTypeAny).description || 'No description',
    ])
  )

const mockInteraction = {
  _creationTime: 1721565340841.6702,
  _id: 'jd7fw7ptr90jp42yj2d09afcxn6xahe0',
  content: {
    choices: [
      'At the bottom of the loop',
      'At the top of the loop',
      'Halfway up the loop',
      'The normal force is constant throughout the loop',
    ],
    isCorrect: [true, false, false, false],
    task: 'A rollercoaster car enters a vertical loop at high speed. At which point in the loop does the car experience the greatest normal force?',
  },
  firstSeen: 1721565347123,
  lastSeen: 1721565551589,
  userActions: [
    {
      id: 'R6I_',
      timeStamp: 1721565356811,
      type: 'multipleChoiceAnswer',
      value: {
        choice: 'At the bottom of the loop',
        isCorrect: true,
      },
    },
    {
      hasSubmitted: true,
      id: '',
      timeStamp: 1721565357958,
      type: 'button-click',
      value: 'submit',
    },
  ],
}
console.log(summarizeInteraction(mockInteraction))

// console.log(jsyaml.dump(mockInteractions.map(summarizeInteraction)))

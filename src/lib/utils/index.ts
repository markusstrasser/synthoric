import { type ClassValue, clsx } from 'clsx'
import * as jsyaml from 'js-yaml'
import { formatDistanceToNow } from 'date-fns'
import type { z } from 'zod'

export const formatTimeAgo = (timeStamp: number): string => {
  const date = new Date(timeStamp / 1000) // Convert microseconds to milliseconds
  return formatDistanceToNow(date, { addSuffix: true })
}

export const isObjectEmpty = (obj: Record<string, unknown>): boolean =>
  Object.keys(obj).length === 0

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// const getLatestAction = (specType: string) => (actions: UserAction[]) =>
//   actions
//     .filter(action => action.fromSpec === specType)
//     .sort((a, b) => b.timeStamp - a.timeStamp)[0]

// export const filterUserActions = (userActions: UserAction[]) => {
//   //TODO: this is hacky
//   const getLatest = getLatestAction('SOLUTION')(userActions)
//   const getText = getLatestAction('TextInput')(userActions)
//   return [
//     getLatest,
//     getText,
//     ...userActions.filter(action => !['SOLUTION', 'TextInput'].includes(action.fromSpec)),
//   ]
// }

//@ts-ignore
export const omit = (keys: string[], obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))

//@ts-ignore
export const summarizeInteraction = ({ _creationTime, content, userActions = [] }) => ({
  interactedLast: formatTimeAgo(_creationTime),
  content,
  userActions,
})

export const schema2dict = (zodSchema: z.ZodObject<z.ZodRawShape>) =>
  Object.fromEntries(
    Object.entries(zodSchema.shape).map(([key, value]) => [
      key,
      (value as z.ZodTypeAny).description || 'No description',
    ])
  )

const mockInteractions = [
  {
    _creationTime: 1720031075337.9485,
    _id: 'jd75apycpd5j81vj7b02cffevn6w6c4h',
    content: { seqIndex: 2, test: 'test Inter' },
  },
  {
    _creationTime: 1720031517397.8645,
    _id: 'jd7dyn36cyq352j0jdhca62fnh6w6t0t',
    content: { test: 'test Inter' },
    interactionIndex: 2,
    seqIndex: 2,
  },
  {
    _creationTime: 502720032185457,
    _id: 'jd7aqytjfrnhea6s9d3j3hxhfh6w6mc4',
    content: { test: 'test Inter' },
    interactionIndex: 0,
    seqIndex: 1,
  },
  {
    _creationTime: 4820032190927.049 * 1000,
    _id: 'jd7968jzyc2tgceh9zq0aq96v56w6hav',
    content: { test: 'test Inter' },
    interactionIndex: 3,
    seqIndex: 2,
  },
  {
    _creationTime: Date.now() * 1000, // Current time in microseconds
    _id: 'jd72tvrr33hrk4a93ad8pe5t5d6w6qt5',
    content: { test: 'test Inter' },
    interactionIndex: 4,
    seqIndex: 2,
  },
]

console.log(jsyaml.dump(mockInteractions.map(summarizeInteraction)))

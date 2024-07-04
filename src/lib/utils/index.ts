import { type ClassValue, clsx } from 'clsx'
import * as jsyaml from 'js-yaml'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow } from 'date-fns'

import { ConvexHttpClient } from 'convex/browser'
// import { api } from '@/convex/_generated/api.js'
import * as dotenv from 'dotenv'
// import {createOpenAI} from 'ai-'

// dotenv.config({ path: '.env.local' })

// // biome-ignore lint/style/noNonNullAssertion: <explanation>
// const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// // const groq = createOpenAI({
// // 	baseURL: "https://api.groq.com/openai/v1",
// // 	apiKey: process.env.GROQ_API_KEY,
// // });
// // const llama70b = groq("llama3-70b-8192");
// export const getContext = async () => {
//   const pathToQuery = {
//     interaction: api.interactions.getLast,
//   }
//   // emitter.emit("getContext", key);
//   const interactions = await client.query(api.interactions.getAll)
//   const previousInferences = await client.query(api.inferences.get)

//   const CONTEXT = {
//     interactions: YAMLify(interactions),
//     inferences: YAMLify(previousInferences),
//   }
//   return CONTEXT
// }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTimeAgo = (timestamp: number): string => {
  const date = new Date(timestamp / 1000) // Convert microseconds to milliseconds
  return formatDistanceToNow(date, { addSuffix: true })
}

export const isObjectEmpty = (obj: Record<string, unknown>): boolean =>
  Object.keys(obj).length === 0

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getLatestAction = (specType: string) => (actions: UserAction[]) =>
  actions
    .filter(action => action.fromSpec === specType)
    .sort((a, b) => b.timeStamp - a.timeStamp)[0]

export const filterUserActions = (userActions: UserAction[]) => {
  //TODO: this is hacky
  const getLatest = getLatestAction('SOLUTION')(userActions)
  const getText = getLatestAction('TextInput')(userActions)
  return [
    getLatest,
    getText,
    ...userActions.filter(action => !['SOLUTION', 'TextInput'].includes(action.fromSpec)),
  ]
}
export const omit = (keys: string[], obj: any) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))

//TODO:
export const compressInteractionsforLLM = (interactions: Interaction[]) => {
  return interactions.map(summarizeInteraction)
}

export const summarizeInteraction = ({ _creationTime, content, userActions = [] }) => ({
  interactedLast: formatTimeAgo(_creationTime),
  content,
  userActions,
})
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

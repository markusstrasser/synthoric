import { type ClassValue, clsx } from 'clsx'
import * as jsyaml from 'js-yaml'
import { twMerge } from 'tailwind-merge'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api.js'
import * as dotenv from 'dotenv'
// import {createOpenAI} from 'ai-'

dotenv.config({ path: '.env.local' })

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// const groq = createOpenAI({
// 	baseURL: "https://api.groq.com/openai/v1",
// 	apiKey: process.env.GROQ_API_KEY,
// });
// const llama70b = groq("llama3-70b-8192");
export const getContext = async () => {
  const pathToQuery = {
    interaction: api.interactions.getLast,
  }
  // emitter.emit("getContext", key);
  const interactions = await client.query(api.interactions.getAll)
  const previousInferences = await client.query(api.inferences.get)

  const CONTEXT = {
    interactions: YAMLify(interactions),
    inferences: YAMLify(previousInferences),
  }
  return CONTEXT
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function JSON2YAML(jsonData: string) {
  return jsyaml.dump(JSON.parse(jsonData))
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

export const YAMLify = (obj: object) => JSON2YAML(JSON.stringify(obj))

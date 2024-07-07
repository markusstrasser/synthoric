import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import * as dotenv from 'dotenv'
dotenv.config()
import { ConvexHttpClient } from 'convex/browser'

// console.log(process.env, 'env ')
const convexKey = process.env.PUBLIC_CONVEX_URL || 'nokey'

if (convexKey === 'nokey') {
  throw new Error('No convex key found')
}
//@ts-ignore
export const convexClient = new ConvexHttpClient(convexKey)

//! using dotenv will crash convex deploys. Node 20+ finds .env files by default i guess
export const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { ConvexHttpClient } from 'convex/browser'
import { GROQ_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY } from '$env/static/private'
import { PUBLIC_CONVEX_URL } from '$env/static/public'
// import * as dotenv from 'dotenv'
// dotenv.config()

export const groq = createOpenAI({
  // export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

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

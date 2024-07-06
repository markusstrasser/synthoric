import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'

//! using dotenv will crash convex deploys. Node 20+ finds .env files by default i guess
export const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

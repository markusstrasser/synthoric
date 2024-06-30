import * as dotenv from 'dotenv'
import { createOpenAI } from '@ai-sdk/openai'
dotenv.config()
import { createAnthropic } from '@ai-sdk/anthropic'
export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// console.log('env', process.env)

export const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

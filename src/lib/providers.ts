import * as dotenv from 'dotenv'
dotenv.config()
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'

// console.log('env', process.env)

export const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

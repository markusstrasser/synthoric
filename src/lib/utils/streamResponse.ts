import { Anthropic } from '@anthropic-ai/sdk'
import StreamingJSONParser from './StreamingJSONParser'
import toolDispatcher from '../../../markus_TODO/toolDispatcher'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const streamResponse = async (
  { prefill, promptWithSchema }: { prefill: string; promptWithSchema: string },
  onKeyValuePair: (pair: Record<string, any>) => void
) => {
  const parser = new StreamingJSONParser(prefill)
  parser.on('keyValuePair', onKeyValuePair)
  console.log(promptWithSchema, 'promptwith schema')
  const stream = anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
    system: promptWithSchema,
    messages: [
      { role: 'user', content: '<waiting for interaction>' },
      { role: 'assistant', content: prefill }, //? prefils help the LLM adhering to schema
    ],
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      parser.processChunk(chunk.delta.text)
    }
  }

  //? the final object
  return parser.getFinalObject()
}

// Example usage:

streamResponse(toolDispatcher, pair => console.log('New key-value pair:', pair))
  .then(console.log)
  .catch(console.error)

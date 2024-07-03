import { type RequestHandler, json } from '@sveltejs/kit'
import { anthropic } from '$lib/providers'
import { generateObject } from 'ai'
import { z } from 'zod'
import { ApplicationExplainer } from '$lib/prompts/snippets'

export const GET: RequestHandler = async () => {
  // const res = await anthropic.createCompletion({
  //   messages: [{ role: 'user', content: 'Hello!' }],
  // })
  const { object } = await generateObject({
    prompt: `${ApplicationExplainer}`,
    model: anthropic('claude-3-5-sonnet-20240620'),
    schema: z.object({
      title: z.string(),
      tagline: z.string(),
    }),
  })
  return json(object)
}

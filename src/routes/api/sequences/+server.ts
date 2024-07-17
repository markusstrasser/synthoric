import { ApplicationExplainer } from '$lib/prompts'
import { anthropic } from '$lib/providers'
import SequencePreview from '$lib/tools/AIToolConfigs/SequencePreview'
import { type RequestHandler, json } from '@sveltejs/kit'
import { generateObject } from 'ai'
import { z } from 'zod'
import Tools from '$lib/tools'
const topic = 'physics'

export const GET: RequestHandler = async () => {
  // const res = await anthropic.createCompletion({
  //   messages: [{ role: 'user', content: 'Hello!' }],
  // })
  console.log('Fetching new Sequence Previews')
  const { SequencePreview } = Tools
  const prompt = `
  
  ${ApplicationExplainer}
    The user is currently on the home screen and chosing between for new course sequences to learn.
    The user is displayed card previews for each possible next sequence.
  
    ${SequencePreview.prompt}
    
    `

  //@ts-ignore
  const content = await SequencePreview.execute(prompt)
  console.log(content, 'content')
  return json([content])
}

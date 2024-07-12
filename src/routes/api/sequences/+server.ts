import { ApplicationExplainer } from '$lib/prompts'
import { anthropic } from '$lib/providers'
import SequencePreview from '$lib/tools/AIToolConfigs/SequencePreview'
import { type RequestHandler, json } from '@sveltejs/kit'
import { generateObject } from 'ai'
import { z } from 'zod'

const topic = 'physics'

export const GET: RequestHandler = async () => {
  // const res = await anthropic.createCompletion({
  //   messages: [{ role: 'user', content: 'Hello!' }],
  // })
  console.log('Fetching new Sequence Previews')

  //TODO: sequencePreview.executeBatch()
  const { object } = await generateObject({
    //${ContextExplainerTemplate}
    prompt: `${ApplicationExplainer}
    
    The user is current on the home screen and chosing between for new course sequences to learn.
    The user is displayed card previews for each possible next sequence.
    
    A sequence is usually about 10-30 minutes of work so scope the content for what can be learned in that time!
    

    To help personalize the preview info
    The user's most recent interests are: ${topic}
    `,

    model: anthropic('claude-3-5-sonnet-20240620'),
    schema: z.object({
      content: z.array(SequencePreview.schema).length(3),
    }),
  })

  return json(object.content)
}

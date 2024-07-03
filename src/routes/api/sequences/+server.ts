import { type RequestHandler, json } from '@sveltejs/kit'
import { anthropic } from '$lib/providers'
import { generateObject } from 'ai'
import { z } from 'zod'
import { ApplicationExplainer, ContextExplainerTemplate } from '$lib/prompts/snippets'

const topic = 'physics'

export const GET: RequestHandler = async () => {
  // const res = await anthropic.createCompletion({
  //   messages: [{ role: 'user', content: 'Hello!' }],
  // })
  console.log('Fetching new Sequence Previews')
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
      content: z
        .array(
          z.object({
            title: z.string().describe('A short title, maximally 7 words'),
            tagline: z
              .string()
              .describe(
                'A short tagline that gives a "trailer" or "sneak peak" of the possible learnings within the sequence, if chosen. Maximally 30 words'
              ),
            prerequisites: z
              .array(z.string())
              .describe(
                'A list of specific subtopics that a user should know before taking this sequence. If the user already knows these topics, the sequence can be skipped.'
              ),
          })
        )
        .length(3),
    }),
  })
  return json(object.content)
}

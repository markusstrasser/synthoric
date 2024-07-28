import { ApplicationExplainer } from '$lib/prompts'
import { anthropic, convexClient } from '$lib/providers'
import SequencePreview from '$lib/tools/AIToolConfigs/SequencePreview'
import { type RequestHandler, json } from '@sveltejs/kit'
import { generateObject } from 'ai'
import { z } from 'zod'
import Tools from '$lib/tools'
import { combineKnowledgeComponentsAndInsights, summarizeInteraction } from '$utils/index'
import { api } from '$convex/_generated/api'
const topic = 'physics'

export const POST: RequestHandler = async ({ request }) => {
  const { isInterleaved } = await request.json()
  console.log('Fetching new Sequence Previews', { isInterleaved })
  const { SequencePreview } = Tools

  const { interactions, sequences, knowledgeComponents, userInsights } = await convexClient.query(
    api.general.getAllContext,
    {}
  )

  const mergedInsights = combineKnowledgeComponentsAndInsights(knowledgeComponents, userInsights)
  const taglines = sequences.map(s => s.tagline)

  const contextString = `
  Here's some Context so that the sequence you generate is not repetitive or duplicate.
  
  >> Existing, ie. previously generated, sequence taglines: ${taglines.join(', ')}

  ${
    isInterleaved &&
    `
    Additionally, the user wants to have a sequence that is different BUT connects to things he already was exposed to creatively. 
    
    Here's some context for you so you can create a sequence concept that ties in and interleaves previous encountered content imaginatively. 
    >> The knowledge state we have about the user: 
    <userinsights>
    ${JSON.stringify(mergedInsights)}
    </userinsights>
    >> Here are the previous interactions the user has engaged with:
    <interactions>
    ${JSON.stringify(interactions.map(summarizeInteraction))}
    </interactions>
  `
  }
  `

  const prompt = `${ApplicationExplainer}
    The user is currently on the home screen and chosing between for new course sequences to learn.
    The user is displayed card previews for each possible next sequence.
    
    ${contextString}

    `
  //@ts-ignore
  const content = await SequencePreview.execute(prompt)
  console.log(content, 'content')
  return json([content])
}

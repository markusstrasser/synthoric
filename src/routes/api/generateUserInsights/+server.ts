import { json, type RequestHandler } from '@sveltejs/kit'
import { api } from '$convex/_generated/api.js'
import { convexClient } from '$lib/providers'
import createContextPrompt from '$lib/createContextPrompt'
import Tools from '$lib/tools'
import { omit } from '$utils/index'

export const POST: RequestHandler = async ({ request }) => {
  const { seqIndex } = await request.json()
  const test = seqIndex || 0
  const context = await convexClient.query(api.interactions.getContext, {
    seqIndex: test,
  })

  //? right now fetches entire tables from the Database
  // const { interactions, userInsights, knowledgeComponents, sequence } = context

  // const interactionRefMap = interactions.map((interaction, index) => {
  //   return {
  //     id: interaction._id,
  //     ref: `I${index}`,
  //   }
  // })

  // const knowledgeComponentsRefMap = knowledgeComponents.map((knowledgeComponent, index) => {
  //   return {
  //     id: knowledgeComponent._id,
  //     ref: `K${index}`,
  //   }
  // })

  // for (const interaction of interactions) {
  //   interaction.ref = interactionRefMap.find(entry => entry.id === interaction._id)?.ref
  // }
  // for (const knowledgeComponent of knowledgeComponents) {
  //   knowledgeComponent.ref = knowledgeComponentsRefMap.find(
  //     entry => entry.id === knowledgeComponent._id
  //   )?.ref
  // }

  console.log(context.interactions, 'interactions')
  const contextStr = createContextPrompt(context)

  const insights = await Tools.UserInsight.execute(contextStr)

  console.log(insights, 'INSIGHTS')
  //extract all new knowledge components

  for (const insight of insights) {
    const KC = insight.knowledgeComponentIdOrDescription
    const isNewKnowledgeComponent = (KC.trim().split(/\s+/) || []).length > 1

    if (isNewKnowledgeComponent) {
      console.log(KC, 'NEW KNOWLEDGE COMPONENT')
      //? exchange description for ID before upserting userInsight
      const KCId = await convexClient.mutation(api.knowledgeComponents.create, {
        knowledgeComponent: KC,
      })

      insight.KCId = KCId
      //!
      console.log(insight, 'OVERWRITTEN to ID')
    }

    await convexClient.mutation(api.userInsights.create, {
      userInsight: omit(['knowledgeComponentIdOrDescription'], insight),
    })
  }

  return json({ sucess: true })
}

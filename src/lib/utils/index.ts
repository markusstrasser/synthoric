import * as jsyaml from 'js-yaml'
import type { z } from 'zod'
import moment from 'moment'
import { api } from '$convex/_generated/api'
import { convexClient } from '$lib/providers'
import type { Doc } from '$convex/_generated/dataModel'

export const formatRelativeTimeAgo = (timeStamp: number): string => moment(timeStamp).fromNow()

export const isObjectEmpty = (obj: Record<string, unknown>): boolean =>
  Object.keys(obj).length === 0

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

//@ts-ignore
export const omit = (keys: string[], obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))

//@ts-ignore
export const summarizeInteraction = ({
  content,
  userActions = [],
  firstSeen,
  systemFeedback,
  _id,
}) => {
  const submitAction = userActions.find(action => action.value === 'submit')

  if (!submitAction) {
    //? unfinished interactions don't count
    return {}
  }
  const RelativefirstSeen = formatRelativeTimeAgo(firstSeen)
  return {
    //TODO: make more robust for non-task
    _id,
    task: content.task || content.text,
    choices: content.choices || 'freeform-input',
    userInputs: userActions
      .filter(action => action.value !== 'submit')
      .map(({ type, timeStamp, ...rest }) => {
        const timeInSeconds = (timeStamp - firstSeen) / 1000
        return {
          type,
          timeUntilActionInSeconds: timeInSeconds,
          ...rest,
          // ...(typeof value === 'object' && value !== null ? value : { value }),
        }
      }),

    timeUntilSubmitInSeconds: (submitAction.timeStamp - firstSeen) / 1000,
    taskFirstSeen: RelativefirstSeen,
    // systemFeedback,
  }
}

export const schema2dict = (zodSchema: z.ZodObject<z.ZodRawShape>) =>
  Object.fromEntries(
    Object.entries(zodSchema.shape).map(([key, value]) => [
      key,
      (value as z.ZodTypeAny).description || 'No description',
    ])
  )

export function combineKnowledgeComponentsAndInsights(
  knowledgeComponents: Doc['knowledgeComponents'][],
  insights: Doc['userInsights'][]
) {
  // Create a map of knowledge components for quick lookup
  const kcMap = new Map(
    knowledgeComponents.map(kc => [
      kc._id,
      {
        id: kc._id,
        content: kc.content,
        type: null, // We'll fill this from the insights
        insights: [],
      },
    ])
  )

  // Process insights and add them to the corresponding knowledge components
  for (const insight of insights) {
    const kc = kcMap.get(insight.KCId)
    if (kc) {
      // Set the type from the first insight (assuming it doesn't change)
      if (!kc.type) {
        kc.type = insight.type
      }

      //@ts-ignore
      kc.insights.push({
        id: insight._id,
        assumedMasteryLevel: insight.assumedMasteryLevel,
        systemConfidence: insight.systemConfidence,
        timeAgo: formatRelativeTimeAgo(insight._creationTime),
        timestamp: insight._creationTime,
        sources: insight.sources,
      })
    }
  }

  // Convert the map back to an array and sort by the latest insight timestamp
  return Array.from(kcMap.values())
    .filter(kc => kc.insights.length > 0) // Remove KCs without insights
    .sort((a, b) => {
      const latestA = Math.max(...a.insights.map(i => i.timestamp))
      const latestB = Math.max(...b.insights.map(i => i.timestamp))
      return latestB - latestA // Sort descending (most recent first)
    })
}
export const joinInteractionsWithSequences = (
  sequences: Doc['sequences'][],
  interactions: Doc['interactions'][]
) => {
  for (const sequence of sequences) {
    sequence.fullInteractions = []
    for (const InteractionIds in sequence.interaction) {
      const interaction = interactions.find(i => i._id === InteractionIds)
      if (interaction) {
        sequence.fullInteractions.push(interaction)
      }
    }
  }
  return sequences
}

const mockInteraction = {
  _creationTime: 1721565340841.6702,
  _id: 'jd7fw7ptr90jp42yj2d09afcxn6xahe0',
  content: {
    choices: [
      'At the bottom of the loop',
      'At the top of the loop',
      'Halfway up the loop',
      'The normal force is constant throughout the loop',
    ],
    isCorrect: [true, false, false, false],
    task: 'A rollercoaster car enters a vertical loop at high speed. At which point in the loop does the car experience the greatest normal force?',
  },
  firstSeen: 1721565347123,
  lastSeen: 1721565551589,
  userActions: [
    {
      id: 'R6I_',
      timeStamp: 1721565356811,
      type: 'multipleChoiceAnswer',
      value: {
        choice: 'At the bottom of the loop',
        isCorrect: true,
      },
    },
    {
      id: '',
      timeStamp: 1721565357958,
      type: 'button-click',
      value: 'submit',
    },
  ],
}
console.log(summarizeInteraction(mockInteraction))
// console.log(await convexClient.query(api.interactions.getAll))
export const updateStatus = async (status: string) => {
  await convexClient.mutation(api.cache.newStatus, {
    status,
  })
}

// console.log(jsyaml.dump(mockInteractions.map(summarizeInteraction)))

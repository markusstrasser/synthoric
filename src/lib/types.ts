import type { z } from 'zod'
import type { UserAction as UserActionSchema } from '$schemas'
import type * as AIToolConfigs from './tools/AIToolConfigs'

// Create and export individual types for each AI tool
export type AITypes = {
  [K in keyof typeof AIToolConfigs]: z.infer<(typeof AIToolConfigs)[K]['schema']>
}

//TODO: this kinda repetition bothers me
export type UserAction = z.infer<typeof UserActionSchema>
export type Hint = AITypes['Hint']
export type MultipleChoiceTask = AITypes['MultipleChoiceTask']
export type UserInsight = AITypes['UserInsight']
export type SubmissionReview = AITypes['SubmissionReview']
export type Solution = AITypes['Solution']
export type SequencePreview = AITypes['SequencePreview']

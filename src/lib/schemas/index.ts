import { z } from 'zod'

export const UserAction = z.object({
  id: z.string(),
  isFinal: z.boolean().default(false).optional(),
  value: z.unknown(),
  timeAfterInteractionStartInSeconds: z.number().optional(),
  timeStamp: z.number().optional(),
  type: z.string().optional(),
  isCorrect: z.boolean().optional(),
})

export type UserAction = z.infer<typeof UserAction>

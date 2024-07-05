import { z } from 'zod'

export const UserAction = z.object({
  id: z.string(),
  isFinal: z.boolean().default(false),
  value: z.unknown(),
  timeAfterInteractionStartInSeconds: z.number(),
  timeStamp: z.number(),
})

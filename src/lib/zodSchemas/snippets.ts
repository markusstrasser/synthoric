import { z } from 'zod'

const interactionElementSchema = z.object({
  fromSpec: z.enum(['TASK', 'HINTS', 'SOLUTION', 'TextInput']),
  gen: z.any(),
  id: z.string(),
})

export type Atom = z.infer<typeof interactionElementSchema>

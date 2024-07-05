import { z } from 'zod'

export default {
  description: 'A short task with freeform text input and a corresponding solution',
  prompt:
    'Generate a short exercise task for the user. The user can answer with open ended text input (<input /> UI).',

  params: z.any(),
  schema: z.string(),
}

import { z } from 'zod'
import { defaultStudentDescription } from '../../prompts'

const topic = 'physics'
const description = `A concise preview for a focused, 5-20 minute ${topic} learning sequence. 
The sequence should cover a theme or a collection of concepts that can be meaningfully explored (holistically) in the given time frame. 
${defaultStudentDescription}`

export default {
  description,
  prompt: `Generate ${description}. The preview should highlight a single, clear physics concept or application, suitable for a short interactive learning experience`,
  schema: z.object({
    title: z
      .string()
      .describe('A specific, focused title for the learning sequence (max 15 words)'),
    tagline: z
      .string()
      .describe('An engaging 1-3 sentence description that captures the essence of the sequence'),
    prerequisites: z
      .array(z.string())
      .describe('Specific concepts or skills the student should already understand'),
  }),
}

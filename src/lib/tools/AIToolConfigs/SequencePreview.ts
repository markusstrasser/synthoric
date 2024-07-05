import { z } from 'zod'

const description = 'a preview for a short 5-30 minute learning sequence'
export default {
  description,
  prompt: `Generate ${description}`,
  schema: z.object({
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
  }),
}

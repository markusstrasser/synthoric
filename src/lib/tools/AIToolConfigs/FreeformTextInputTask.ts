import { MarkdownFormattingPrompt } from '../../prompts'
import { z } from 'zod'

const description =
  'A short exercise task that assumes the user can answer with freeform text input (input form UI). The task is designed to be answered in a few words or a paragraph maximum'
export default {
  description,
  prompt: `Generate ${description}`,

  params: z.any(),
  schema: z.object({
    text: z
      .string()
      .describe(
        `The full text content of the task presented to the user in Markdown. ${MarkdownFormattingPrompt}`
      ),
  }),
}

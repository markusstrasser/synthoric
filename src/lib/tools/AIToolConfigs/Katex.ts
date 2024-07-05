import z from 'zod'

export default {
  description: 'Shows a mathematical expression in correct Katex format',
  prompt: 'Show the following mathematical expression in correct Katex format:',
  schema: z
    .string()
    .describe(
      'The Katex syntax compliant expression to show in the katex component. Be wary of escape characters'
    ),
}

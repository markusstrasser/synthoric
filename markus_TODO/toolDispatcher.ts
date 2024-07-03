import { ApplicationExplainer } from '$lib/prompts/snippets'
import { z } from 'zod'
import { createTool } from '$lib/tools'

const schema = z
  .object({
    tool: z.enum(['exercise', 'multipleChoice', 'binaryChoice']),
    count: z.number().min(1).max(5).describe('The number of consequtive interactions to generate'),
    prompts: z
      .array(z.string())
      .describe(
        'the prompts for the tool. The tool will call an LLM with each of the prompts to generate the interaction data. Be specific.'
      ),
    // params: z
    // 	.array(z.string())
    // 	.describe("the params that go with each prompt"),
  })
  .describe('The tool the next AI agent can use')

const prompt = `${ApplicationExplainer}
----
I want you to decide on the best next interaction type to serve to the user. You have the following types to chose from:

'exercise': A text problem with freeform text/expression input from the student, followed by a step-by-step solution after submit. 
'multipleChoice': A multiple choice question with a list of options for the user to choose from. 
'binaryChoice': Multiple choice but with only two options. This is best used for quick diagnostics and intuition check of the user in a given subdomain (ie. classical mechanics or more granular angular momentum and so on)

The user likes binary choice examples.

Just MUST output valid JSON. And your output should have ALL the keys of the follow the following JSON schema:
----
`
export default createTool(prompt, schema)

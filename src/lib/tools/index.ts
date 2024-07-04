import { zodToJsonSchema } from 'zod-to-json-schema'
import type { z } from 'zod'
import solution from './solution'
// import task from './task'
import review from './review'

//TODO: add batch and single prompt/schemas
export { solution, review }
/* 
constant_name_str = "CONSTANT_NAME"
globals()[constant_name_str] = "Hello, World!"  # Assigns the value "Hello, World!" to CONSTANT_NAME


const IxSeqTypes = ['TextExercise', 'BooleanStorm', 'GraphMaster']
const classes = ['TASK', 'SOLUTION', 'TOOL', 'FEEDBACK', 'HINT', 'INPUT_UI']
*/

// export const generateSubmissionReview = async interaction => {
//   const prompt = `The following is a task/exercise the user just completed. You're given the solution, the actions the user took (including the final input).
//     Please evaluate the user's submission and rate it.
//     Give short, targeted, technical feedback.
//     * If the student forgets to give the right physical units (ie. 100 instead of 100 m/s) iff it was obvious from the task text and you can assume it's just an oversight, not a conceptual misunderstanding you can give benefit of a doubt (full rating credit) BUT mention it inside the review.
//     * If the student gets the right answer but wrong units (100m/s instead of 100m for example), it's wrong (1), but it seems he did the calculation correct. You can mention that

//     The INTERACTION:::
//     ${YAMLify(interaction)}
//     :::
//     `
//   const { object } = await generateObject({
//     prompt,
//     model: openai('gpt-4o'),
//     schema: SubmissionReviewSchema,
//   })
//   console.log('Submission Review::', object)
//   return object
// }

const getJsonSchema = (schema: z.ZodObject<any>) => {
  const { $schema, ...schemaObject } = zodToJsonSchema(schema)
  return schemaObject
}
export const createTool = (prompt: string, schema: z.ZodObject<any>) => ({
  prompt,
  zodSchema: schema,
  get jsonSchema() {
    const jsonSchema = getJsonSchema(this.zodSchema)
    //? if z.object vs z.string
    return jsonSchema.properties || jsonSchema
  },
  get promptWithSchema() {
    return `${this.prompt} <schema>${JSON.stringify(this.jsonSchema)}</schema>`
  },
  get prefill() {
    const jsonSchema = getJsonSchema(this.zodSchema)
    return jsonSchema.type === 'object' ? `{"${Object.keys(jsonSchema.properties)[0]}":` : ''
  },
})

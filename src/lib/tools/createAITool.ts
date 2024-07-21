import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import type * as AIToolConfigs from './AIToolConfigs'
import { generateObject } from 'ai'
import { anthropic } from '../../lib/providers'

const getJsonSchema = (schema: z.ZodType) => {
  const { $schema, ...schemaObject } = zodToJsonSchema(schema)
  return schemaObject
}

type ZodObjectSchema = z.ZodObject<z.ZodRawShape>
const AIToolConfigSchema = <T extends ZodObjectSchema>(schema: T) =>
  z.object({
    prompt: z.string(),
    description: z.string(),
    schema,
    params: schema,
    examples: z.array(schema).optional(),
  })

export type AIToolConfig<T extends ZodObjectSchema> = z.infer<
  ReturnType<typeof AIToolConfigSchema<T>>
> & {
  execute?: (prompt: string, options?: Record<string, unknown>) => Promise<z.infer<T>>
}

const enhanceSchema = (schema: ReturnType<typeof getJsonSchema>) => ({
  jsonSchema: 'properties' in schema ? schema.properties : schema,
  prefill:
    'properties' in schema && schema.type === 'object'
      ? `{"${Object.keys(schema.properties)[0]}":`
      : '',
})

export default <T extends keyof typeof AIToolConfigs>(config: (typeof AIToolConfigs)[T]) => {
  const enhancedSchema = enhanceSchema(getJsonSchema(config.schema))

  //TODO: add configs or prompt variation / injection methods
  const defaultExecute = async (
    input: string,
    options = {}
  ): Promise<z.infer<typeof config.schema>> => {
    //TODO: make work with arrays, objects, z.string
    const composedPrompt = `${config.prompt} 
    -----
    ${JSON.stringify(input)}
    `
    console.log('prompt in tool', composedPrompt)
    const { object } = await generateObject({
      prompt: composedPrompt,
      model: anthropic('claude-3-5-sonnet-20240620'),
      schema: z.object({ content: config.schema as z.ZodType }),
    })
    return config.schema.parse(object.content)
  }

  const enhancedConfig = {
    ...config,
    ...enhancedSchema,
    promptWithSchema: `${config.prompt} <schema>${JSON.stringify(enhancedSchema.jsonSchema)}</schema>`,
  }

  return 'execute' in config ? enhancedConfig : { ...enhancedConfig, execute: defaultExecute }
}

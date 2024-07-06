import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { convexClient } from '../providers'
import { api } from '$convex/_generated/api'

const interactions = await convexClient.query(api.interactions.getAll)

console.log(interactions, 'interactions')
zodToJsonSchema(z.string().describe('aaa'))

console.log(zodToJsonSchema(z.string().describe('aaa')))

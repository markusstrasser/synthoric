import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { z } from 'zod'
import { customCtx, NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomQuery, zCustomMutation, zid } from 'convex-helpers/server/zod'
import * as s from '../lib/schemas'
import { SubmissionReview } from '../lib/tools/AIToolConfigs'
import { UserAction } from '../lib/schemas'
// Types based on your schema
import type { Id } from './_generated/dataModel'
import type { Doc } from './_generated/dataModel'
import { getWithSourcesMapped } from './userInsights'

export const getAllContext = query({
  args: {},
  handler: async ctx => {
    const [interactions, userInsights, sequences, knowledgeComponents] = await Promise.all([
      ctx.db.query('interactions').collect(),
      ctx.db.query('userInsights').collect(),
      // getWithSourcesMapped(ctx, {}),
      ctx.db.query('sequences').collect(),
      ctx.db.query('knowledgeComponents').collect(),
    ])

    return { interactions, userInsights, sequences, knowledgeComponents }
  },
})

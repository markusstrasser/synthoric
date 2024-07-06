import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getStatus = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query('cache').first()
  },
})
export const newStatus = mutation({
  args: {
    status: v.string(),
  },
  handler: async ({ db }, { status }) => {
    return await db.insert('cache', { status })
  },
})

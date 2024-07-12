import { convexClient } from '$lib/providers'


export const handle = async ({ event, resolve }) => {
  event.locals.convexClient = convexClient
  return await resolve(event)
}

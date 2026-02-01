import { getAuthenticatedUser } from '../utils/auth'

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  // Only protect /api/admin/* routes
  if (!path.startsWith('/api/admin')) {
    return
  }

  const user = getAuthenticatedUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Authentication required',
    })
  }

  // Attach user to event context for use in handlers
  event.context.user = user
})

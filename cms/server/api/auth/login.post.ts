import { loginSchema } from '../../../app/shared/schemas'
import { comparePassword, generateToken, setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const { email, password } = result.data
  const config = useRuntimeConfig()

  // Check credentials
  if (email !== config.adminEmail) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Nieprawidłowy email lub hasło',
    })
  }

  const isValidPassword = await comparePassword(password, config.adminPasswordHash)
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Nieprawidłowy email lub hasło',
    })
  }

  // Generate token and set cookie
  const token = generateToken(email)
  setAuthCookie(event, token)

  return {
    success: true,
    user: { email },
  }
})

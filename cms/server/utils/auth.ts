import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'

const TOKEN_EXPIRY = '7d'
const COOKIE_NAME = 'auth_token'

interface TokenPayload {
  email: string
  iat: number
  exp: number
}

export function generateToken(email: string): string {
  const config = useRuntimeConfig()
  return jwt.sign({ email }, config.jwtSecret, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const config = useRuntimeConfig()
    return jwt.verify(token, config.jwtSecret) as TokenPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function setAuthCookie(event: H3Event, token: string): void {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export function clearAuthCookie(event: H3Event): void {
  deleteCookie(event, COOKIE_NAME)
}

export function getTokenFromEvent(event: H3Event): string | null {
  // Try cookie first
  const cookieToken = getCookie(event, COOKIE_NAME)
  if (cookieToken) return cookieToken

  // Try Authorization header
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return null
}

export function getAuthenticatedUser(event: H3Event): TokenPayload | null {
  const token = getTokenFromEvent(event)
  if (!token) return null
  return verifyToken(token)
}

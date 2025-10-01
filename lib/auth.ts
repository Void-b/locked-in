import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
console.log('JWT_SECRET used:', JWT_SECRET)
const COOKIE_NAME = 'lockedin_token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  sameSite: 'lax' as const,
}

export interface JWTPayload {
  userId: string
  isAdmin: boolean
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (e) {
    console.log('Verify error:', e)
    return null
  }
}

export function setTokenCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)
}

export function getTokenCookie(req: NextRequest): string | undefined {
  return req.cookies.get(COOKIE_NAME)?.value
}

export function clearTokenCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 })
}

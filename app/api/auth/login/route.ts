import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validation'
import { signToken, setTokenCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.parse(body)

    let user = await prisma.user.findUnique({
      where: { email: parsed.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: { email: parsed.email, name: parsed.email.split('@')[0] },
      })
    }

    const token = signToken({ userId: user.id.toString(), isAdmin: user.isAdmin })
    const res = NextResponse.json({ success: true })
    setTokenCookie(res, token)
    return res
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

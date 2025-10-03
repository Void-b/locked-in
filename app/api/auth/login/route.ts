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
      const isAdminUser = parsed.email === 'admin@example.com'
      user = await prisma.user.create({
        data: { email: parsed.email, name: parsed.email.split('@')[0], isAdmin: isAdminUser },
      })
      console.log(`Created new user ${user.email} with isAdmin=${user.isAdmin}`)
    }

    if (user.email === 'admin@example.com' && !user.isAdmin) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isAdmin: true },
      })
      console.log(`Updated user ${user.email} to isAdmin=true`)
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

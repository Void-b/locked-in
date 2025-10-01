import { NextRequest, NextResponse } from 'next/server'
import { getTokenCookie, verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const token = getTokenCookie(request)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userPayload = verifyToken(token)
  if (!userPayload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userPayload.userId },
    select: { email: true, name: true }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ email: user.email, name: user.name })
}

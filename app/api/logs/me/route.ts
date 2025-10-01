import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { parseISO, startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('lockedin_token')?.value
  const user = token ? verifyToken(token) : null

  console.log('Token:', token)
  console.log('User:', user)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')

  let fromDate: Date | undefined
  let toDate: Date | undefined

  try {
    if (from) {
      if (from === 'today') {
        fromDate = startOfDay(new Date())
      } else {
        fromDate = parseISO(from)
      }
    }
    if (to) {
      if (to === 'today') {
        toDate = endOfDay(new Date())
      } else {
        toDate = parseISO(to)
      }
    }
  } catch {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  const where: any = { userId: String(user.userId) }
  if (fromDate && toDate) {
    where.date = { gte: fromDate, lte: toDate }
  } else if (fromDate) {
    where.date = { gte: fromDate }
  } else if (toDate) {
    where.date = { lte: toDate }
  }

  const logs = await prisma.dailyLog.findMany({
    where,
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(logs)
}

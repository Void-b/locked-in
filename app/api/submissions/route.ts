import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { submissionSchema } from '@/lib/validation'
import { toLagosDate } from '@/lib/dates'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const token = request.headers.get('cookie')?.split('lockedin_token=')[1]
    const user = token ? verifyToken(token) : null

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User in submissions API:', user)

    // Pagination and filtering params
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    let fromDate: Date | undefined
    let toDate: Date | undefined

    try {
      if (from) {
        fromDate = toLagosDate(new Date(from))
      }
      if (to) {
        toDate = toLagosDate(new Date(to))
      }
    } catch {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    const where: any = {}

    if (user.isAdmin) {
      // Admin can see all logs
      if (fromDate && toDate) {
        where.date = { gte: fromDate, lte: toDate }
      } else if (fromDate) {
        where.date = { gte: fromDate }
      } else if (toDate) {
        where.date = { lte: toDate }
      }
    } else {
      // Non-admin see only their logs
      where.userId = String(user.userId)
      if (fromDate && toDate) {
        where.date = { gte: fromDate, lte: toDate }
      } else if (fromDate) {
        where.date = { gte: fromDate }
      } else if (toDate) {
        where.date = { lte: toDate }
      }
    }

    const total = await prisma.dailyLog.count({ where })

    const logs = await prisma.dailyLog.findMany({
      where,
      include: user.isAdmin ? { user: true } : undefined,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const logsWithEmail = user.isAdmin
      ? logs.map((log: any) => ({
          ...log,
          userEmail: log.user?.email,
        }))
      : logs

    return NextResponse.json({ logs: logsWithEmail, total })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('lockedin_token=')[1]
    const user = token ? verifyToken(token) : null

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = submissionSchema.parse(body)

    // Check for existing log today (idempotency)
    const now = new Date()
    const today = toLagosDate(now)
    const existing = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: String(user.userId),
          date: today,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Already submitted today' }, { status: 409 })
    }

    const log = await prisma.dailyLog.create({
      data: {
        userId: String(user.userId),
        date: today,
        personalGrowth: parsed.personalGrowth,
        physicalActivity: parsed.physicalActivity,
        waterIntake: parsed.waterIntake,
        dailyTask: parsed.dailyTask,
        journal: parsed.journal,
        prayerMeditation: parsed.prayerMeditation,
        weeklyChallenge: parsed.weeklyChallenge,
        submittedAt: toLagosDate(now),
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

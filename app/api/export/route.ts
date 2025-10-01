import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { createObjectCsvWriter } from 'csv-writer'

export async function GET(request: Request) {
  const token = request.headers.get('cookie')?.split('lockedin_token=')[1]
  const user = token ? verifyToken(token) : null

  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const logs = await prisma.dailyLog.findMany({
      include: { user: true },
      orderBy: { submittedAt: 'desc' },
    })

    const csvWriter = createObjectCsvWriter({
      path: '/tmp/logs.csv', // In production, use a proper temp dir
      header: [
        { id: 'id', title: 'ID' },
        { id: 'email', title: 'Email' },
        { id: 'date', title: 'Date' },
        { id: 'personalGrowth', title: 'Personal Growth' },
        { id: 'physicalActivity', title: 'Physical Activity' },
        { id: 'waterIntake', title: 'Water Intake' },
        { id: 'dailyTask', title: 'Daily Task' },
        { id: 'journal', title: 'Journal' },
        { id: 'prayerMeditation', title: 'Prayer/Meditation' },
        { id: 'weeklyChallenge', title: 'Weekly Challenge' },
        { id: 'submittedAt', title: 'Submitted At' },
      ],
    })

    await csvWriter.writeRecords(
      logs.map((log: any) => ({
        id: log.id,
        email: log.user.email,
        date: log.date.toISOString().split('T')[0],
        personalGrowth: log.personalGrowth,
        physicalActivity: log.physicalActivity,
        waterIntake: log.waterIntake,
        dailyTask: log.dailyTask,
        journal: log.journal,
        prayerMeditation: log.prayerMeditation,
        weeklyChallenge: log.weeklyChallenge,
        submittedAt: log.submittedAt.toISOString(),
      }))
    )

    const csvContent = await require('fs').promises.readFile('/tmp/logs.csv', 'utf8')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=logs.csv',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

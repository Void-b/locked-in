import { PrismaClient } from '@prisma/client'
import { toLagosDate } from '../lib/dates'

const prisma = new PrismaClient()

async function cleanLogs() {
  const date29 = toLagosDate(new Date('2025-09-29'))
  const date30 = toLagosDate(new Date('2025-09-30'))
  const date1 = toLagosDate(new Date('2025-10-01'))

  // Delete logs not in the specified dates
  await prisma.dailyLog.deleteMany({
    where: {
      date: {
        notIn: [date29, date30, date1],
      },
    },
  })

  // For each date, keep only 2 logs
  const dates = [date29, date30, date1]
  for (const date of dates) {
    const logs = await prisma.dailyLog.findMany({
      where: { date },
      orderBy: { submittedAt: 'desc' },
    })
    if (logs.length > 2) {
      const toDelete = logs.slice(2).map((log: { id: string }) => log.id)
      await prisma.dailyLog.deleteMany({
        where: { id: { in: toDelete } },
      })
    }
  }

  console.log('Logs cleaned successfully')
}

cleanLogs()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

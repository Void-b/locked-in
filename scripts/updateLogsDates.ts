import { PrismaClient } from '@prisma/client'
import { toLagosDate } from '../lib/dates'

const prisma = new PrismaClient()

async function updateLogs() {
  // Update some logs to have matching date and submittedAt for testing

  // For September 29, 2025
  const date29 = toLagosDate(new Date('2025-09-29'))
  await prisma.dailyLog.updateMany({
    where: {
      date: date29,
    },
    data: {
      submittedAt: date29,
    },
  })

  // For September 30, 2025
  const date30 = toLagosDate(new Date('2025-09-30'))
  await prisma.dailyLog.updateMany({
    where: {
      date: date30,
    },
    data: {
      submittedAt: date30,
    },
  })

  // For October 1, 2025
  const date1 = toLagosDate(new Date('2025-10-01'))
  await prisma.dailyLog.updateMany({
    where: {
      date: date1,
    },
    data: {
      submittedAt: date1,
    },
  })

  console.log('Logs updated successfully')
}

updateLogs()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

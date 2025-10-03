import { PrismaClient } from '@prisma/client'
import { toLagosDate } from '../lib/dates'

const prisma = new PrismaClient()

async function updateSubmittedAt() {
  const logs = await prisma.dailyLog.findMany({
    select: { id: true, submittedAt: true }
  })

  for (const log of logs) {
    const lagosSubmittedAt = toLagosDate(log.submittedAt)
    await prisma.dailyLog.update({
      where: { id: log.id },
      data: { submittedAt: lagosSubmittedAt }
    })
  }

  console.log('SubmittedAt timestamps updated to Lagos timezone')
}

updateSubmittedAt()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

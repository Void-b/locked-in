import { prisma } from '@/lib/prisma'

async function main() {
  const logs = await prisma.dailyLog.findMany({
    include: { user: true },
    orderBy: { date: 'desc' },
  })

  logs.forEach((log: any) => {
    console.log({
      id: log.id,
      userEmail: log.user?.email || 'N/A',
      date: log.date,
      personalGrowth: log.personalGrowth,
      physicalActivity: log.physicalActivity,
      waterIntake: log.waterIntake,
      dailyTask: log.dailyTask,
      prayerMeditation: log.prayerMeditation,
      weeklyChallenge: log.weeklyChallenge,
      journal: log.journal,
      submittedAt: log.submittedAt,
    })
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

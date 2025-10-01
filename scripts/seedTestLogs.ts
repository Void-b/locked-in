import { PrismaClient } from '@prisma/client'
import { toLagosDate } from '../lib/dates'

const prisma = new PrismaClient()

async function seedTestLogs() {
  // Get or create users
  let user1 = await prisma.user.findFirst({ where: { email: 'test1@example.com' } })
  if (!user1) {
    user1 = await prisma.user.create({
      data: {
        email: 'test1@example.com',
        name: 'Test User 1',
      },
    })
  }

  let user2 = await prisma.user.findFirst({ where: { email: 'test2@example.com' } })
  if (!user2) {
    user2 = await prisma.user.create({
      data: {
        email: 'test2@example.com',
        name: 'Test User 2',
      },
    })
  }

  const dates = [
    toLagosDate(new Date('2025-09-29')),
    toLagosDate(new Date('2025-09-30')),
    toLagosDate(new Date('2025-10-01')),
  ]

  for (const date of dates) {
    // Create 2 logs per date
    await prisma.dailyLog.create({
      data: {
        userId: user1.id,
        date,
        personalGrowth: true,
        physicalActivity: true,
        waterIntake: true,
        dailyTask: true,
        prayerMeditation: true,
        weeklyChallenge: true,
        submittedAt: date,
      },
    })

    await prisma.dailyLog.create({
      data: {
        userId: user2.id,
        date,
        personalGrowth: false,
        physicalActivity: false,
        waterIntake: false,
        dailyTask: false,
        prayerMeditation: false,
        weeklyChallenge: false,
        submittedAt: date,
      },
    })
  }

  console.log('Test logs seeded successfully')
}

seedTestLogs()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

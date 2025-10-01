import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      isAdmin: true,
    },
  })

  // Create regular users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      name: 'User One',
      email: 'user1@example.com',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      name: 'User Two',
      email: 'user2@example.com',
    },
  })

  // Create sample daily logs
  await prisma.dailyLog.create({
    data: {
      userId: user1.id,
      date: new Date(),
      personalGrowth: true,
      physicalActivity: true,
      waterIntake: true,
      dailyTask: true,
      journal: 'Worked on coding project',
      prayerMeditation: true,
      weeklyChallenge: false,
    },
  })

  await prisma.dailyLog.create({
    data: {
      userId: user2.id,
      date: new Date(),
      personalGrowth: true,
      physicalActivity: false,
      waterIntake: true,
      dailyTask: true,
      journal: 'Read a book on TypeScript',
      prayerMeditation: true,
      weeklyChallenge: true,
    },
  })

  console.log('Seeded database with demo data')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

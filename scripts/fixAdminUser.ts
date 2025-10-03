import { prisma } from '@/lib/prisma'

async function fixAdminUser() {
  const adminEmail = 'admin@example.com'
  const user = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!user) {
    console.log(`Admin user with email ${adminEmail} does not exist.`)
    return
  }

  if (user.isAdmin) {
    console.log(`Admin user ${adminEmail} already has admin privileges.`)
    return
  }

  await prisma.user.update({
    where: { email: adminEmail },
    data: { isAdmin: true },
  })

  console.log(`Admin user ${adminEmail} has been granted admin privileges.`)
}

fixAdminUser()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

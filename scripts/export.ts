import { createObjectCsvWriter } from 'csv-writer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const submissions = await prisma.submission.findMany({
    include: { user: true },
    orderBy: { submittedAt: 'desc' },
  })

  const csvWriter = createObjectCsvWriter({
    path: 'submissions.csv',
    header: [
      { id: 'id', title: 'ID' },
      { id: 'email', title: 'Email' },
      { id: 'content', title: 'Content' },
      { id: 'submittedAt', title: 'Submitted At' },
    ],
  })

  const records = submissions.map(sub => ({
    id: sub.id,
    email: sub.user.email,
    content: sub.content,
    submittedAt: sub.submittedAt.toISOString(),
  }))

  await csvWriter.writeRecords(records)
  console.log('Exported submissions to submissions.csv')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

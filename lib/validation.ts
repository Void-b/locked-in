import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
})

export const submissionSchema = z.object({
  personalGrowth: z.boolean(),
  physicalActivity: z.boolean(),
  waterIntake: z.boolean(),
  dailyTask: z.boolean(),
  journal: z.string().optional(),
  prayerMeditation: z.boolean(),
  weeklyChallenge: z.boolean(),
})

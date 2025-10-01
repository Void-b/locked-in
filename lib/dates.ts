import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const TIMEZONE = 'Africa/Lagos'

export function toLagosDate(date: Date): Date {
  return utcToZonedTime(date, TIMEZONE)
}

export function fromLagosDate(date: Date): Date {
  return zonedTimeToUtc(date, TIMEZONE)
}

export function isSameLagosDay(date1: Date, date2: Date): boolean {
  const d1 = toLagosDate(date1)
  const d2 = toLagosDate(date2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

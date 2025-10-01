import { toLagosDate, fromLagosDate, isSameLagosDay } from '../lib/dates'

describe('Date utilities', () => {
  it('should convert to Lagos timezone', () => {
    const date = new Date('2023-01-01T00:00:00Z')
    const lagosDate = toLagosDate(date)
    expect(lagosDate.getHours()).toBe(1) // UTC+1
  })

  it('should check same day in Lagos', () => {
    const date1 = new Date('2023-01-01T00:00:00Z') // 01:00 Lagos
    const date2 = new Date('2023-01-01T22:59:59Z') // 23:59 Lagos same day
    expect(isSameLagosDay(date1, date2)).toBe(true)
  })
})

import { signToken, verifyToken } from '../lib/auth'

describe('Auth utilities', () => {
  it('should sign and verify token correctly', () => {
    const payload = { userId: '1', isAdmin: false }
    const token = signToken(payload)
    const verified = verifyToken(token)
    expect(verified?.userId).toBe(payload.userId)
    expect(verified?.isAdmin).toBe(payload.isAdmin)
  })

  it('should return null for invalid token', () => {
    const verified = verifyToken('invalid')
    expect(verified).toBeNull()
  })
})

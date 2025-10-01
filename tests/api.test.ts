import { loginSchema, submissionSchema } from '../lib/validation'

describe('Validation schemas', () => {
  it('should validate login schema', () => {
    const valid = loginSchema.parse({ email: 'test@example.com' })
    expect(valid.email).toBe('test@example.com')

    expect(() => loginSchema.parse({ email: 'invalid' })).toThrow()
  })

  it('should validate submission schema', () => {
    const valid = submissionSchema.parse({ content: 'Test content' })
    expect(valid.content).toBe('Test content')

    expect(() => submissionSchema.parse({ content: '' })).toThrow()
  })
})

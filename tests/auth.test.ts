import { beforeAll, describe, expect, it } from 'vitest'
import {
  emailSchema,
  passwordSchema,
} from '../lib/server/auth-validation'
import {
  createSessionToken,
  verifySessionToken,
} from '../lib/server/jwt'
import {
  hashPassword,
  verifyPassword,
} from '../lib/server/password'
import {
  createOneTimeToken,
  hashOneTimeToken,
} from '../lib/server/tokens'

beforeAll(() => {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/autopaper-test'
  process.env.JWT_SECRET =
    'test-only-secret-that-is-longer-than-thirty-two-characters'
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  process.env.RESEND_API_KEY = 're_test'
  process.env.EMAIL_FROM = 'AutoPaper <test@example.com>'
})

describe('password security', () => {
  it('hashes and verifies passwords without storing plaintext', async () => {
    const hash = await hashPassword('StrongPass1')

    expect(hash).not.toContain('StrongPass1')
    expect(await verifyPassword('StrongPass1', hash)).toBe(true)
    expect(await verifyPassword('WrongPass1', hash)).toBe(false)
  })
})

describe('one-time tokens', () => {
  it('stores only a deterministic hash of a random token', () => {
    const first = createOneTimeToken()
    const second = createOneTimeToken()

    expect(first.token).not.toBe(second.token)
    expect(first.tokenHash).toBe(hashOneTimeToken(first.token))
    expect(first.tokenHash).not.toContain(first.token)
  })
})

describe('JWT sessions', () => {
  it('verifies valid tokens and rejects tampered or expired tokens', () => {
    const token = createSessionToken(
      {
        id: 'user-1',
        email: 'teacher@example.com',
        name: 'Teacher',
        sessionVersion: 2,
      },
      1_000,
    )

    expect(verifySessionToken(token, 1_001)?.sub).toBe('user-1')
    expect(verifySessionToken(`${token}x`, 1_001)).toBeNull()
    expect(verifySessionToken(token, 1_000 + 60 * 60 * 24 * 8)).toBeNull()
  })
})

describe('auth validation', () => {
  it('normalizes email and enforces strong passwords', () => {
    expect(emailSchema.parse(' Teacher@Example.COM ')).toBe(
      'teacher@example.com',
    )
    expect(passwordSchema.safeParse('weak').success).toBe(false)
    expect(passwordSchema.safeParse('StrongPass1').success).toBe(true)
  })
})

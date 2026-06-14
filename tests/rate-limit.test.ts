import { beforeEach, describe, expect, it } from 'vitest'
import {
  checkRateLimit,
  clearRateLimitStore,
} from '../lib/server/rate-limit'

describe('checkRateLimit', () => {
  beforeEach(() => clearRateLimitStore())

  it('allows requests up to the configured limit', () => {
    expect(checkRateLimit('test', 2, 1_000, 0).allowed).toBe(true)
    expect(checkRateLimit('test', 2, 1_000, 100).allowed).toBe(true)
    expect(checkRateLimit('test', 2, 1_000, 200).allowed).toBe(false)
  })

  it('resets after the window expires', () => {
    checkRateLimit('test', 1, 1_000, 0)
    expect(checkRateLimit('test', 1, 1_000, 500).allowed).toBe(false)
    expect(checkRateLimit('test', 1, 1_000, 1_001).allowed).toBe(true)
  })
})

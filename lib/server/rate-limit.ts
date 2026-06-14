type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitStore = Map<string, RateLimitEntry>

declare global {
  var __rateLimitStore: RateLimitStore | undefined
}

const store = global.__rateLimitStore ?? new Map<string, RateLimitEntry>()
global.__rateLimitStore = store

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  return (
    forwardedFor?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
) {
  const existing = store.get(key)

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return {
      allowed: true,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1_000),
    }
  }

  existing.count += 1

  return {
    allowed: existing.count <= limit,
    remaining: Math.max(limit - existing.count, 0),
    retryAfterSeconds: Math.max(
      Math.ceil((existing.resetAt - now) / 1_000),
      1,
    ),
  }
}

export function clearRateLimitStore() {
  store.clear()
}

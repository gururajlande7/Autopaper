import 'server-only'
import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto'
import { getServerEnv } from '@/lib/server/env'

export const SESSION_COOKIE_NAME = 'autopaper_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export type SessionPayload = {
  sub: string
  email: string
  name: string
  sessionVersion: number
  iat: number
  exp: number
  iss: 'autopaper'
  aud: 'autopaper-web'
  jti: string
}

function encodeJson(value: object) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function sign(unsignedToken: string) {
  return createHmac('sha256', getServerEnv().JWT_SECRET)
    .update(unsignedToken)
    .digest('base64url')
}

export function createSessionToken(
  user: {
    id: string
    email: string
    name: string
    sessionVersion: number
  },
  now = Math.floor(Date.now() / 1_000),
) {
  const header = encodeJson({ alg: 'HS256', typ: 'JWT' })
  const payload = encodeJson({
    sub: user.id,
    email: user.email,
    name: user.name,
    sessionVersion: user.sessionVersion,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
    iss: 'autopaper',
    aud: 'autopaper-web',
    jti: randomUUID(),
  } satisfies SessionPayload)
  const unsignedToken = `${header}.${payload}`

  return `${unsignedToken}.${sign(unsignedToken)}`
}

export function verifySessionToken(
  token: string,
  now = Math.floor(Date.now() / 1_000),
): SessionPayload | null {
  const [header, payload, signature] = token.split('.')

  if (!header || !payload || !signature) {
    return null
  }

  const expectedSignature = Buffer.from(sign(`${header}.${payload}`))
  const suppliedSignature = Buffer.from(signature)

  if (
    expectedSignature.length !== suppliedSignature.length ||
    !timingSafeEqual(expectedSignature, suppliedSignature)
  ) {
    return null
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as Partial<SessionPayload>

    if (
      typeof parsed.sub !== 'string' ||
      typeof parsed.email !== 'string' ||
      typeof parsed.name !== 'string' ||
      typeof parsed.sessionVersion !== 'number' ||
      typeof parsed.iat !== 'number' ||
      typeof parsed.exp !== 'number' ||
      parsed.iss !== 'autopaper' ||
      parsed.aud !== 'autopaper-web' ||
      typeof parsed.jti !== 'string' ||
      parsed.exp <= now ||
      parsed.iat > now + 60
    ) {
      return null
    }

    return parsed as SessionPayload
  } catch {
    return null
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
}

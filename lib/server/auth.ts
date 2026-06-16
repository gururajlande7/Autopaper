import 'server-only'
import { cookies } from 'next/headers'
import { connectToDatabase } from '@/lib/db'
import { UserModel } from '@/models/user'
import {
  SESSION_COOKIE_NAME,
  type SessionPayload,
  verifySessionToken,
} from '@/lib/server/jwt'

function readCookieHeader(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return undefined
  }

  for (const cookie of cookieHeader.split(';')) {
    const [cookieName, ...valueParts] = cookie.trim().split('=')

    if (cookieName === name) {
      return decodeURIComponent(valueParts.join('='))
    }
  }

  return undefined
}

async function findSessionUser(payload: SessionPayload) {
  await connectToDatabase()

  const user = await UserModel.findById(payload.sub)
    .select('name email emailVerifiedAt sessionVersion')
    .lean<{
      _id: { toString(): string }
      name: string
      email: string
      emailVerifiedAt?: Date
      sessionVersion: number
    }>()

  if (
    !user ||
    !user.emailVerifiedAt ||
    user.sessionVersion !== payload.sessionVersion
  ) {
    return null
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    emailVerified: true as const,
    sessionVersion: user.sessionVersion,
  }
}

export async function getUserFromRequest(request: Request) {
  const token = readCookieHeader(
    request.headers.get('cookie'),
    SESSION_COOKIE_NAME,
  )

  if (!token) {
    return null
  }

  const payload = verifySessionToken(token)
  return payload ? findSessionUser(payload) : null
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const payload = verifySessionToken(token)
  return payload ? findSessionUser(payload) : null
}

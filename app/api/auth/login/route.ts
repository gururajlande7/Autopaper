import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { loginSchema } from '@/lib/server/auth-validation'
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '@/lib/server/jwt'
import { logInfo } from '@/lib/server/logger'
import { verifyPassword } from '@/lib/server/password'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { readJsonBody } from '@/lib/server/request'
import { UserModel } from '@/models/user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const rateLimit = checkRateLimit(`login:${clientIp}`, 10, 15 * 60_000)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429 },
    )
  }

  const requestBody = await readJsonBody(request)

  if (requestBody.response) {
    return requestBody.response
  }

  const parsed = loginSchema.safeParse(requestBody.body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 400 },
    )
  }

  await connectToDatabase()

  const user = await UserModel.findOne({ email: parsed.data.email }).select(
    '+passwordHash name email emailVerifiedAt sessionVersion',
  )

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 },
    )
  }

  if (!user.emailVerifiedAt) {
    return NextResponse.json(
      {
        error: 'Verify your email before signing in.',
        code: 'EMAIL_NOT_VERIFIED',
      },
      { status: 403 },
    )
  }

  user.lastLoginAt = new Date()
  await user.save()

  const token = createSessionToken({
    id: user.id,
    name: user.name,
    email: user.email,
    sessionVersion: user.sessionVersion,
  })
  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: true,
    },
  })
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions)

  logInfo('auth.logged_in', { userId: user.id })
  return response
}

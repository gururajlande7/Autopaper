import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { resetPasswordSchema } from '@/lib/server/auth-validation'
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '@/lib/server/jwt'
import { hashPassword } from '@/lib/server/password'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { readJsonBody } from '@/lib/server/request'
import { hashOneTimeToken } from '@/lib/server/tokens'
import { UserModel } from '@/models/user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const rateLimit = checkRateLimit(`reset:${clientIp}`, 5, 60 * 60_000)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many reset attempts. Try again later.' },
      { status: 429 },
    )
  }

  const requestBody = await readJsonBody(request)

  if (requestBody.response) {
    return requestBody.response
  }

  const parsed = resetPasswordSchema.safeParse(requestBody.body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid request.' },
      { status: 400 },
    )
  }

  await connectToDatabase()
  const user = await UserModel.findOne({
    passwordResetTokenHash: hashOneTimeToken(parsed.data.token),
    passwordResetExpiresAt: { $gt: new Date() },
    emailVerifiedAt: { $exists: true },
  }).select(
    '+passwordHash +passwordResetTokenHash +passwordResetExpiresAt name email sessionVersion',
  )

  if (!user) {
    return NextResponse.json(
      { error: 'This password reset link is invalid or expired.' },
      { status: 400 },
    )
  }

  user.passwordHash = await hashPassword(parsed.data.password)
  user.passwordResetTokenHash = undefined
  user.passwordResetExpiresAt = undefined
  user.sessionVersion += 1
  await user.save()

  const token = createSessionToken({
    id: user.id,
    name: user.name,
    email: user.email,
    sessionVersion: user.sessionVersion,
  })
  const response = NextResponse.json({
    message: 'Password updated successfully.',
  })
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions)
  return response
}

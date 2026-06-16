import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { emailRequestSchema } from '@/lib/server/auth-validation'
import { sendPasswordResetEmail } from '@/lib/server/email'
import { logError } from '@/lib/server/logger'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { readJsonBody } from '@/lib/server/request'
import { createOneTimeToken } from '@/lib/server/tokens'
import { UserModel } from '@/models/user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const rateLimit = checkRateLimit(`forgot:${clientIp}`, 5, 60 * 60_000)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 },
    )
  }

  const requestBody = await readJsonBody(request)

  if (requestBody.response) {
    return requestBody.response
  }

  const parsed = emailRequestSchema.safeParse(requestBody.body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Enter a valid email address.' },
      { status: 400 },
    )
  }

  await connectToDatabase()
  const user = await UserModel.findOne({
    email: parsed.data.email,
    emailVerifiedAt: { $exists: true },
  }).select('+passwordResetTokenHash +passwordResetExpiresAt name email')

  if (user) {
    const { token, tokenHash } = createOneTimeToken()
    user.passwordResetTokenHash = tokenHash
    user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60_000)
    await user.save()

    try {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        token,
      })
    } catch (error) {
      logError('auth.password_reset_email_failed', error, {
        userId: user.id,
      })
    }
  }

  return NextResponse.json({
    message:
      'If a verified account exists, a password reset email has been sent.',
  })
}

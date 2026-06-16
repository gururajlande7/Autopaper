import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { emailRequestSchema } from '@/lib/server/auth-validation'
import { sendVerificationEmail } from '@/lib/server/email'
import { logError } from '@/lib/server/logger'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { readJsonBody } from '@/lib/server/request'
import { createOneTimeToken } from '@/lib/server/tokens'
import { UserModel } from '@/models/user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const rateLimit = checkRateLimit(`resend:${clientIp}`, 3, 60 * 60_000)

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
    emailVerifiedAt: { $exists: false },
  }).select(
    '+emailVerificationTokenHash +emailVerificationExpiresAt name email',
  )

  if (user) {
    const { token, tokenHash } = createOneTimeToken()
    user.emailVerificationTokenHash = tokenHash
    user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60_000)
    await user.save()

    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        token,
      })
    } catch (error) {
      logError('auth.verification_email_failed', error, { userId: user.id })
      return NextResponse.json(
        { error: 'Unable to send verification email right now.' },
        { status: 503 },
      )
    }
  }

  return NextResponse.json({
    message:
      'If an unverified account exists, a verification email has been sent.',
  })
}

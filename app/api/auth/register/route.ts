import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { registerSchema } from '@/lib/server/auth-validation'
import { sendVerificationEmail } from '@/lib/server/email'
import { logError, logInfo } from '@/lib/server/logger'
import { hashPassword } from '@/lib/server/password'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { readJsonBody } from '@/lib/server/request'
import { createOneTimeToken } from '@/lib/server/tokens'
import { UserModel } from '@/models/user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  const clientIp = getClientIp(request)
  const rateLimit = checkRateLimit(`register:${clientIp}`, 5, 15 * 60_000)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Try again later.' },
      { status: 429 },
    )
  }

  const requestBody = await readJsonBody(request)

  if (requestBody.response) {
    return requestBody.response
  }

  const parsed = registerSchema.safeParse(requestBody.body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid registration.' },
      { status: 400 },
    )
  }

  await connectToDatabase()

  const existingUser = await UserModel.findOne({ email: parsed.data.email })
    .select('emailVerifiedAt')
    .lean<{ emailVerifiedAt?: Date }>()

  if (existingUser?.emailVerifiedAt) {
    return NextResponse.json(
      { error: 'An account with this email already exists.' },
      { status: 409 },
    )
  }

  if (existingUser) {
    return NextResponse.json(
      {
        error:
          'This email is awaiting verification. Use resend verification.',
      },
      { status: 409 },
    )
  }

  const passwordHash = await hashPassword(parsed.data.password)
  const { token, tokenHash } = createOneTimeToken()
  let createdUserId: string | undefined

  try {
    const user = await UserModel.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiresAt: new Date(Date.now() + 24 * 60 * 60_000),
    })
    createdUserId = user.id

    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token,
    })

    logInfo('auth.registered', {
      requestId,
      userId: user.id,
    })

    return NextResponse.json(
      {
        message:
          'Account created. Check your email to verify your account.',
      },
      { status: 201 },
    )
  } catch (error) {
    if (createdUserId) {
      await UserModel.deleteOne({ _id: createdUserId }).catch(() => undefined)
    }

    logError('auth.registration_failed', error, { requestId })

    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 },
      )
    }

    return NextResponse.json(
      { error: 'Unable to create the account right now.' },
      { status: 503 },
    )
  }
}

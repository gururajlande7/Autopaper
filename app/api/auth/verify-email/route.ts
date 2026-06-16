import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectToDatabase } from '@/lib/db'
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '@/lib/server/jwt'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { readJsonBody } from '@/lib/server/request'
import { hashOneTimeToken } from '@/lib/server/tokens'
import { UserModel } from '@/models/user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const verificationSchema = z.object({
  token: z.string().min(20).max(200),
})

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const rateLimit = checkRateLimit(`verify:${clientIp}`, 10, 60 * 60_000)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many verification attempts. Try again later.' },
      { status: 429 },
    )
  }

  const requestBody = await readJsonBody(request)

  if (requestBody.response) {
    return requestBody.response
  }

  const parsed = verificationSchema.safeParse(requestBody.body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'This verification link is invalid or expired.' },
      { status: 400 },
    )
  }

  await connectToDatabase()

  const user = await UserModel.findOne({
    emailVerificationTokenHash: hashOneTimeToken(parsed.data.token),
    emailVerificationExpiresAt: { $gt: new Date() },
  }).select(
    '+emailVerificationTokenHash +emailVerificationExpiresAt name email sessionVersion',
  )

  if (!user) {
    return NextResponse.json(
      { error: 'This verification link is invalid or expired.' },
      { status: 400 },
    )
  }

  user.emailVerifiedAt = new Date()
  user.emailVerificationTokenHash = undefined
  user.emailVerificationExpiresAt = undefined
  await user.save()

  const sessionToken = createSessionToken({
    id: user.id,
    name: user.name,
    email: user.email,
    sessionVersion: user.sessionVersion,
  })
  const response = NextResponse.json({
    message: 'Email verified successfully.',
  })
  response.cookies.set(
    SESSION_COOKIE_NAME,
    sessionToken,
    sessionCookieOptions,
  )
  return response
}

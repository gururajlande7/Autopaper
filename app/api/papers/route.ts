import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  generatePaper,
  PaperGenerationError,
} from '@/lib/paper/generate'
import {
  DIFFICULTIES,
  isDifficulty,
  isPaperMode,
  isSubject,
  PAPER_MODES,
  SUBJECTS,
} from '@/lib/paper/types'
import { getChapterCount } from '@/lib/paper/patterns'
import {
  DAILY_PAPER_LIMIT,
  FREE_GUEST_PAPER_LIMIT,
  releaseDailyPaper,
  reserveDailyPaper,
} from '@/lib/server/daily-paper-limit'
import { checkRateLimit, getClientIp } from '@/lib/server/rate-limit'
import { logError, logInfo } from '@/lib/server/logger'
import { getUserFromRequest } from '@/lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 15

const requestSchema = z.object({
  subject: z.string().refine(isSubject, 'Select a supported subject.'),
  mode: z
    .string()
    .refine(isPaperMode, 'Select a supported paper type.')
    .default('full'),
  chapter: z.number().int().positive().optional(),
  difficulty: z
    .string()
    .refine(isDifficulty, 'Select a supported difficulty.')
    .default('medium'),
})

const MAX_REQUEST_BYTES = 1_024
const GUEST_COOKIE_NAME = 'autopaper_guest_id'

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

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  requestId: string,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Request-Id': requestId,
    },
  })
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  const clientIp = getClientIp(request)
  const rateLimit = checkRateLimit(`paper:${clientIp}`, 10, 60_000)
  let quotaId: string | undefined
  let newGuestId: string | undefined

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many paper requests. Please wait and try again.' },
      {
        status: 429,
        headers: {
          'Cache-Control': 'no-store',
          'Retry-After': String(rateLimit.retryAfterSeconds),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-Request-Id': requestId,
        },
      },
    )
  }

  try {
    const user = await getUserFromRequest(request)
    const existingGuestId = readCookieHeader(
      request.headers.get('cookie'),
      GUEST_COOKIE_NAME,
    )
    const guestId = existingGuestId || crypto.randomUUID()
    newGuestId = existingGuestId ? undefined : guestId
    const quotaIdentity = user ? `user:${user.id}` : `guest:${guestId}`
    const dailyLimit = user ? DAILY_PAPER_LIMIT : FREE_GUEST_PAPER_LIMIT

    const contentType = request.headers.get('content-type') || ''

    if (!contentType.toLowerCase().startsWith('application/json')) {
      return jsonResponse(
        { error: 'Content-Type must be application/json.' },
        415,
        requestId,
      )
    }

    const contentLength = Number(request.headers.get('content-length') || 0)

    if (contentLength > MAX_REQUEST_BYTES) {
      return jsonResponse(
        { error: 'Request body is too large.' },
        413,
        requestId,
      )
    }

    const rawBody = await request.text()

    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return jsonResponse(
        { error: 'Request body is too large.' },
        413,
        requestId,
      )
    }

    let body: unknown

    try {
      body = JSON.parse(rawBody)
    } catch {
      return jsonResponse({ error: 'Invalid JSON request.' }, 400, requestId)
    }

    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return jsonResponse(
        {
          error: parsed.error.issues[0]?.message || 'Invalid request.',
          supportedSubjects: SUBJECTS,
          supportedModes: PAPER_MODES,
          supportedDifficulties: DIFFICULTIES,
        },
        400,
        requestId,
      )
    }

    if (
      parsed.data.mode === 'chapter-test' &&
      (!parsed.data.chapter ||
        parsed.data.chapter > getChapterCount(parsed.data.subject))
    ) {
      return jsonResponse(
        { error: 'Select a valid chapter for this subject.' },
        400,
        requestId,
      )
    }

    const dailyQuota = await reserveDailyPaper(quotaIdentity, dailyLimit)

    if (!dailyQuota.allowed) {
      const retryAfterSeconds = Math.max(
        Math.ceil((dailyQuota.resetAt.getTime() - Date.now()) / 1_000),
        1,
      )
      const limitResponse = NextResponse.json(
        {
          error:
            user
              ? "You have reached today's limit of 5 generated papers. Try again tomorrow."
              : 'You have used your 2 free paper generations. Sign in with a verified account to generate more.',
          dailyRemaining: 0,
          dailyLimit,
          requiresSignIn: !user,
        },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': String(retryAfterSeconds),
            'X-Daily-Limit': String(dailyLimit),
            'X-Daily-Remaining': '0',
            'X-Request-Id': requestId,
          },
        },
      )

      if (newGuestId) {
        limitResponse.cookies.set(GUEST_COOKIE_NAME, newGuestId, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
      }

      return limitResponse
    }

    quotaId = dailyQuota.quotaId
    const paper = await generatePaper(
      parsed.data.subject,
      parsed.data.mode,
      parsed.data.chapter,
      parsed.data.difficulty,
    )

    logInfo('paper.generated', {
      requestId,
      userId: user?.id,
      anonymous: !user,
      subject: parsed.data.subject,
      mode: parsed.data.mode,
      chapter: parsed.data.chapter,
      difficulty: parsed.data.difficulty,
      sections: paper.sections.length,
      dailyRemaining: dailyQuota.remaining,
    })

    const response = NextResponse.json(
      {
        paper,
        dailyRemaining: dailyQuota.remaining,
        dailyLimit,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-Daily-Limit': String(dailyLimit),
          'X-Daily-Remaining': String(dailyQuota.remaining),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-Request-Id': requestId,
        },
      },
    )

    if (newGuestId) {
      response.cookies.set(GUEST_COOKIE_NAME, newGuestId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return response
  } catch (error) {
    if (quotaId) {
      try {
        await releaseDailyPaper(quotaId)
      } catch (releaseError) {
        logError('paper.quota_release_failed', releaseError, {
          requestId,
          quotaId,
        })
      }
    }

    if (error instanceof PaperGenerationError) {
      return jsonResponse(
        { error: error.message, details: error.details },
        422,
        requestId,
      )
    }

    logError('paper.generation_failed', error, { requestId })

    return jsonResponse(
      { error: 'Unable to generate the paper right now.' },
      500,
      requestId,
    )
  }
}

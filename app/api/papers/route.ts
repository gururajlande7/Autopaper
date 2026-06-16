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

    if (!user) {
      return jsonResponse(
        { error: 'Sign in with a verified account to generate papers.' },
        401,
        requestId,
      )
    }

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

    const dailyQuota = await reserveDailyPaper(`user:${user.id}`)

    if (!dailyQuota.allowed) {
      return NextResponse.json(
        {
          error:
            "You have reached today's limit of 5 generated papers. Try again tomorrow.",
          dailyRemaining: 0,
        },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': String(
              Math.max(
                Math.ceil(
                  (dailyQuota.resetAt.getTime() - Date.now()) / 1_000,
                ),
                1,
              ),
            ),
            'X-Daily-Limit': String(DAILY_PAPER_LIMIT),
            'X-Daily-Remaining': '0',
            'X-Request-Id': requestId,
          },
        },
      )
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
      userId: user.id,
      subject: parsed.data.subject,
      mode: parsed.data.mode,
      chapter: parsed.data.chapter,
      difficulty: parsed.data.difficulty,
      sections: paper.sections.length,
      dailyRemaining: dailyQuota.remaining,
    })

    return NextResponse.json(
      { paper, dailyRemaining: dailyQuota.remaining },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-Daily-Limit': String(DAILY_PAPER_LIMIT),
          'X-Daily-Remaining': String(dailyQuota.remaining),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-Request-Id': requestId,
        },
      },
    )
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

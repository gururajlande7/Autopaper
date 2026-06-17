import { createHash } from 'node:crypto'
import { connectToDatabase } from '@/lib/db'
import { PaperGenerationQuotaModel } from '@/models/paper-generation-quota'

export const DAILY_PAPER_LIMIT = 5
export const FREE_GUEST_PAPER_LIMIT = 2

function getUtcDay(now: Date) {
  return now.toISOString().slice(0, 10)
}

function getNextUtcDay(now: Date) {
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
    ),
  )
}

function getQuotaId(identity: string, now: Date) {
  return createHash('sha256')
    .update(`${identity}:${getUtcDay(now)}`)
    .digest('hex')
}

export async function reserveDailyPaper(
  identity: string,
  limit = DAILY_PAPER_LIMIT,
  now = new Date(),
) {
  await connectToDatabase()

  const quotaId = getQuotaId(identity, now)

  try {
    const quota = await PaperGenerationQuotaModel.findOneAndUpdate(
      { _id: quotaId, count: { $lt: limit } },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: getNextUtcDay(now) },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).lean()

    const count = quota?.count ?? limit

    return {
      allowed: count <= limit,
      remaining: Math.max(limit - count, 0),
      quotaId,
      resetAt: getNextUtcDay(now),
    }
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 11000
    ) {
      return {
        allowed: false,
        remaining: 0,
        quotaId,
        resetAt: getNextUtcDay(now),
      }
    }

    throw error
  }
}

export async function releaseDailyPaper(quotaId: string) {
  await PaperGenerationQuotaModel.updateOne(
    { _id: quotaId, count: { $gt: 0 } },
    { $inc: { count: -1 } },
  )
}

import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/db'
import { logError } from '@/lib/server/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const startedAt = Date.now()

  try {
    await connectToDatabase()
    await mongoose.connection.db?.admin().ping()

    return NextResponse.json(
      {
        status: 'ok',
        database: 'connected',
        responseTimeMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    logError('health.database_unavailable', error)

    return NextResponse.json(
      {
        status: 'error',
        database: 'unavailable',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    )
  }
}

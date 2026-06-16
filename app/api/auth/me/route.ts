import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/server/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const user = await getUserFromRequest(request)

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json(
    { user },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

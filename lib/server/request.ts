import { NextResponse } from 'next/server'

const MAX_AUTH_BODY_BYTES = 4_096

export async function readJsonBody(request: Request) {
  const contentType = request.headers.get('content-type') || ''

  if (!contentType.toLowerCase().startsWith('application/json')) {
    return {
      response: NextResponse.json(
        { error: 'Content-Type must be application/json.' },
        { status: 415 },
      ),
    }
  }

  const contentLength = Number(request.headers.get('content-length') || 0)

  if (contentLength > MAX_AUTH_BODY_BYTES) {
    return {
      response: NextResponse.json(
        { error: 'Request body is too large.' },
        { status: 413 },
      ),
    }
  }

  const rawBody = await request.text()

  if (new TextEncoder().encode(rawBody).byteLength > MAX_AUTH_BODY_BYTES) {
    return {
      response: NextResponse.json(
        { error: 'Request body is too large.' },
        { status: 413 },
      ),
    }
  }

  try {
    return { body: JSON.parse(rawBody) as unknown }
  } catch {
    return {
      response: NextResponse.json(
        { error: 'Invalid JSON request.' },
        { status: 400 },
      ),
    }
  }
}

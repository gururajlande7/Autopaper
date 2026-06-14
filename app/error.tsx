'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">
          The request could not be completed. Try again, or return home.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-white"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
          <Link
            className="rounded-lg border border-border px-5 py-2.5 font-semibold"
            href="/"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}

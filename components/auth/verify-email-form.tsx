'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { readJsonResponse } from '@/lib/client/api'

export function VerifyEmailForm({ token }: { token: string }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleVerify() {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const result = await readJsonResponse<{ error?: string }>(response)

      if (!response.ok) {
        throw new Error(result.error || 'Unable to verify email.')
      }

      router.push('/create?verified=1')
      router.refresh()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to verify email.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && (
        <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <button
        className="h-11 w-full rounded-xl bg-primary font-semibold text-white disabled:opacity-60"
        disabled={isLoading}
        onClick={handleVerify}
        type="button"
      >
        {isLoading ? 'Verifying...' : 'Verify my email'}
      </button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Link expired?{' '}
        <Link
          className="font-semibold text-primary hover:underline"
          href="/resend-verification"
        >
          Request a new one
        </Link>
      </p>
    </>
  )
}

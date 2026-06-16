'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export function EmailActionForm({
  endpoint,
  buttonLabel,
}: {
  endpoint: '/api/auth/forgot-password' | '/api/auth/resend-verification'
  buttonLabel: string
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = (await response.json()) as {
        error?: string
        message?: string
      }

      if (!response.ok) {
        throw new Error(result.error || 'Unable to process the request.')
      }

      setMessage(result.message || 'Check your email.')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to process the request.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {message && (
        <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Email</span>
          <input
            autoComplete="email"
            className="h-11 w-full rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <button
          className="h-11 w-full rounded-xl bg-primary font-semibold text-white disabled:opacity-60"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Sending...' : buttonLabel}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link className="font-semibold text-primary hover:underline" href="/login">
          Return to sign in
        </Link>
      </p>
    </>
  )
}

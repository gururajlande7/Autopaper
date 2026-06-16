'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { readJsonResponse } from '@/lib/client/api'

export function LoginForm({
  nextPath = '/create',
  initialMessage,
  initialError,
}: {
  nextPath?: string
  initialMessage?: string
  initialError?: string
}) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(initialError || '')
  const [message] = useState(initialMessage || '')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result = await readJsonResponse<{
        error?: string
        code?: string
      }>(response)

      if (!response.ok) {
        throw new Error(result.error || 'Unable to sign in.')
      }

      router.push(nextPath.startsWith('/') ? nextPath : '/create')
      router.refresh()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to sign in.',
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
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Password</span>
          <input
            autoComplete="current-password"
            className="h-11 w-full rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        <div className="flex justify-end">
          <Link
            className="text-sm font-semibold text-primary hover:underline"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

        <button
          className="h-11 w-full rounded-xl bg-primary font-semibold text-white disabled:opacity-60"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to AutoPaper?{' '}
        <Link className="font-semibold text-primary hover:underline" href="/register">
          Create an account
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Email not verified?{' '}
        <Link
          className="font-semibold text-primary hover:underline"
          href="/resend-verification"
        >
          Resend the link
        </Link>
      </p>
    </>
  )
}

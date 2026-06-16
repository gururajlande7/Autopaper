'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const result = (await response.json()) as {
        error?: string
        message?: string
      }

      if (!response.ok) {
        throw new Error(result.error || 'Unable to create account.')
      }

      setMessage(result.message || 'Check your email to verify your account.')
      setPassword('')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to create account.',
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
          <span className="text-sm font-semibold">Name</span>
          <input
            autoComplete="name"
            className="h-11 w-full rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </label>
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
            autoComplete="new-password"
            className="h-11 w-full rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          <span className="block text-xs text-muted-foreground">
            At least 8 characters with uppercase, lowercase, and a number.
          </span>
        </label>

        <button
          className="h-11 w-full rounded-xl bg-primary font-semibold text-white disabled:opacity-60"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered?{' '}
        <Link className="font-semibold text-primary hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </>
  )
}

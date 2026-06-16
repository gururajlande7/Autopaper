'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { readJsonResponse } from '@/lib/client/api'

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const result = await readJsonResponse<{ error?: string }>(response)

      if (!response.ok) {
        throw new Error(result.error || 'Unable to reset password.')
      }

      router.push('/create?password-reset=1')
      router.refresh()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to reset password.',
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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">New password</span>
          <input
            autoComplete="new-password"
            className="h-11 w-full rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold">Confirm password</span>
          <input
            autoComplete="new-password"
            className="h-11 w-full rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            type="password"
            value={confirmPassword}
          />
        </label>
        <p className="text-xs text-muted-foreground">
          Use at least 8 characters with uppercase, lowercase, and a number.
        </p>
        <button
          className="h-11 w-full rounded-xl bg-primary font-semibold text-white disabled:opacity-60"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? 'Updating password...' : 'Update password'}
        </button>
      </form>
    </>
  )
}

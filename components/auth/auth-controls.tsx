'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type AuthUser = {
  id: string
  name: string
  email: string
}

export function AuthControls() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined)

  useEffect(() => {
    let active = true

    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          return null
        }

        const result = (await response.json()) as { user: AuthUser }
        return result.user
      })
      .then((nextUser) => {
        if (active) {
          setUser(nextUser)
        }
      })
      .catch(() => {
        if (active) {
          setUser(null)
        }
      })

    return () => {
      active = false
    }
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  if (user === undefined) {
    return <div className="h-8 w-16 animate-pulse rounded-lg bg-muted sm:w-20" />
  }

  if (!user) {
    return (
      <Link
        className="rounded-lg border border-primary px-2.5 py-1.5 text-xs font-semibold text-primary sm:px-3 sm:py-2 sm:text-sm"
        href="/login"
      >
        Sign in
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        className="hidden max-w-28 truncate text-sm font-semibold hover:text-primary sm:block"
        href="/account"
      >
        {user.name}
      </Link>
      <button
        className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted sm:px-3 sm:py-2 sm:text-sm"
        onClick={handleLogout}
        type="button"
      >
        Sign out
      </button>
    </div>
  )
}

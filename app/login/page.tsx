import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'
import { getCurrentUser } from '@/lib/server/auth'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your AutoPaper account.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string
    verified?: string
    error?: string
  }>
}) {
  const user = await getCurrentUser()

  if (user) {
    redirect('/create')
  }

  const params = await searchParams
  const initialMessage =
    params.verified === '1'
      ? 'Email verified. You can now sign in.'
      : undefined
  const initialError =
    params.error === 'invalid-verification'
      ? 'This verification link is invalid or expired.'
      : undefined

  return (
    <AuthShell
      description="Access your verified account and create question papers."
      title="Welcome back"
    >
      <LoginForm
        initialError={initialError}
        initialMessage={initialMessage}
        nextPath={params.next}
      />
    </AuthShell>
  )
}

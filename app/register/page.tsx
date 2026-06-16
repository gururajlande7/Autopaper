import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'
import { RegisterForm } from '@/components/auth/register-form'
import { getCurrentUser } from '@/lib/server/auth'

export const metadata = {
  title: 'Create Account',
  description: 'Create and verify your AutoPaper account.',
}

export default async function RegisterPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/create')
  }

  return (
    <AuthShell
      description="Create an account, then verify your email address."
      title="Create account"
    >
      <RegisterForm />
    </AuthShell>
  )
}

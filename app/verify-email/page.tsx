import { AuthShell } from '@/components/auth/auth-shell'
import { VerifyEmailForm } from '@/components/auth/verify-email-form'

export const metadata = {
  title: 'Verify Email',
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token = '' } = await searchParams

  return (
    <AuthShell
      description="Confirm that this email address belongs to you."
      title="Verify your email"
    >
      {token ? (
        <VerifyEmailForm token={token} />
      ) : (
        <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          The verification token is missing.
        </p>
      )}
    </AuthShell>
  )
}

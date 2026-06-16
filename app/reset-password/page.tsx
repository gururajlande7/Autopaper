import { AuthShell } from '@/components/auth/auth-shell'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata = {
  title: 'Choose New Password',
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token = '' } = await searchParams

  return (
    <AuthShell
      description="Choose a strong new password for your account."
      title="Choose new password"
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          The password reset token is missing.
        </p>
      )}
    </AuthShell>
  )
}

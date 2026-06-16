import { AuthShell } from '@/components/auth/auth-shell'
import { EmailActionForm } from '@/components/auth/email-action-form'

export const metadata = {
  title: 'Forgot Password',
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      description="We will email a secure one-hour password reset link."
      title="Reset your password"
    >
      <EmailActionForm
        buttonLabel="Send reset link"
        endpoint="/api/auth/forgot-password"
      />
    </AuthShell>
  )
}

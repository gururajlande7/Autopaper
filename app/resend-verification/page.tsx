import { AuthShell } from '@/components/auth/auth-shell'
import { EmailActionForm } from '@/components/auth/email-action-form'

export const metadata = {
  title: 'Resend Verification',
}

export default function ResendVerificationPage() {
  return (
    <AuthShell
      description="Request a fresh 24-hour verification link."
      title="Verify your email"
    >
      <EmailActionForm
        buttonLabel="Send verification link"
        endpoint="/api/auth/resend-verification"
      />
    </AuthShell>
  )
}

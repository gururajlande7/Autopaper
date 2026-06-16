import 'server-only'
import { getServerEnv } from '@/lib/server/env'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

async function sendEmail({
  to,
  subject,
  html,
  text,
  idempotencyKey,
}: {
  to: string
  subject: string
  html: string
  text: string
  idempotencyKey: string
}) {
  const { RESEND_API_KEY, EMAIL_FROM, EMAIL_TEST_RECIPIENT } = getServerEnv()

  if (
    EMAIL_TEST_RECIPIENT &&
    to.toLowerCase() !== EMAIL_TEST_RECIPIENT.toLowerCase()
  ) {
    throw new Error(
      'Email testing is limited to the configured Resend account email.',
    )
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [to],
      subject,
      html,
      text,
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Email provider rejected the request: ${details}`)
  }
}

function emailLayout(title: string, name: string, body: string) {
  return `
    <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a">
      <div style="max-width:560px;margin:auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:32px">
        <h1 style="margin:0 0 20px;color:#ea580c">${escapeHtml(title)}</h1>
        <p>Hello ${escapeHtml(name)},</p>
        ${body}
        <p style="margin-top:28px;color:#64748b;font-size:13px">AutoPaper</p>
      </div>
    </div>
  `
}

export async function sendVerificationEmail({
  email,
  name,
  token,
}: {
  email: string
  name: string
  token: string
}) {
  const { NEXT_PUBLIC_APP_URL } = getServerEnv()
  const verificationUrl = `${NEXT_PUBLIC_APP_URL}/verify-email?token=${encodeURIComponent(token)}`
  const safeUrl = escapeHtml(verificationUrl)

  await sendEmail({
    to: email,
    subject: 'Verify your AutoPaper email',
    idempotencyKey: `verify-${token.slice(0, 32)}`,
    text: `Verify your AutoPaper account: ${verificationUrl}`,
    html: emailLayout(
      'Verify your email',
      name,
      `<p>Confirm your email address to activate your account.</p>
       <p style="margin:28px 0"><a href="${safeUrl}" style="background:#ea580c;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Verify email</a></p>
       <p style="font-size:13px;color:#64748b">This link expires in 24 hours.</p>`,
    ),
  })
}

export async function sendPasswordResetEmail({
  email,
  name,
  token,
}: {
  email: string
  name: string
  token: string
}) {
  const { NEXT_PUBLIC_APP_URL } = getServerEnv()
  const resetUrl = `${NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(token)}`
  const safeUrl = escapeHtml(resetUrl)

  await sendEmail({
    to: email,
    subject: 'Reset your AutoPaper password',
    idempotencyKey: `reset-${token.slice(0, 32)}`,
    text: `Reset your AutoPaper password: ${resetUrl}`,
    html: emailLayout(
      'Reset your password',
      name,
      `<p>Use the button below to choose a new password.</p>
       <p style="margin:28px 0"><a href="${safeUrl}" style="background:#ea580c;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Reset password</a></p>
       <p style="font-size:13px;color:#64748b">This link expires in 1 hour. Ignore this email if you did not request it.</p>`,
    ),
  })
}

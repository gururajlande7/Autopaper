import 'server-only'
import nodemailer from 'nodemailer'
import { getEmailEnv } from '@/lib/server/env'

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
}: {
  to: string
  subject: string
  html: string
  text: string
}) {
  const {
    EMAIL_FROM,
    SMTP_HOST,
    SMTP_PASS,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
  } = getEmailEnv()

  const transporter = nodemailer.createTransport({
    auth: {
      pass: SMTP_PASS,
      user: SMTP_USER,
    },
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
  })

  await transporter.sendMail({
    from: EMAIL_FROM,
    html,
    subject,
    text,
    to,
  })
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
  const { NEXT_PUBLIC_APP_URL } = getEmailEnv()
  const verificationUrl = `${NEXT_PUBLIC_APP_URL}/verify-email?token=${encodeURIComponent(token)}`
  const safeUrl = escapeHtml(verificationUrl)

  await sendEmail({
    to: email,
    subject: 'Verify your AutoPaper email',
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
  const { NEXT_PUBLIC_APP_URL } = getEmailEnv()
  const resetUrl = `${NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(token)}`
  const safeUrl = escapeHtml(resetUrl)

  await sendEmail({
    to: email,
    subject: 'Reset your AutoPaper password',
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

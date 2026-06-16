# Gmail SMTP Email Setup

AutoPaper sends verification and password-reset emails through Gmail SMTP with
Nodemailer. This does not require a custom domain.

## 1. Create Or Choose The Gmail Account

Use the Gmail address you want users to see, for example:

```text
autopaper.official@gmail.com
```

## 2. Turn On 2-Step Verification

In the Google account:

```text
Google Account -> Security -> 2-Step Verification
```

Turn it on. Google App Passwords usually require 2-Step Verification.

## 3. Create A Google App Password

Open:

```text
Google Account -> Security -> App passwords
```

Create an app password for AutoPaper. Copy the 16-character password Google
shows. Use this app password in `SMTP_PASS`; do not use your normal Gmail
password.

## 4. Local Environment

In `.env.local`:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-generated-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=autopaper.official@gmail.com
SMTP_PASS=your-16-character-google-app-password
EMAIL_FROM="AutoPaper <autopaper.official@gmail.com>"

NEXT_PUBLIC_CONTACT_EMAIL=riteshworking247@gmail.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## 5. Vercel Environment

In Vercel:

```text
Project -> Settings -> Environment Variables
```

Add the same variables, but set:

```env
NEXT_PUBLIC_APP_URL=https://autopaper.vercel.app
```

After changing environment variables, redeploy.

## 6. Test

1. Open `https://autopaper.vercel.app/register`.
2. Register with any email address.
3. Check the inbox and spam folder.
4. Click the verification link.
5. Test forgot-password too.

## Gmail Notes

Gmail SMTP is good for early launch and demos, but it has sending limits and
may rate-limit heavy traffic. Later, move to a domain-based provider such as
Resend, SendGrid, or Amazon SES for higher-volume production email.

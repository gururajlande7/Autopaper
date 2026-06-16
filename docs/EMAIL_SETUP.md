# Email Verification Setup

AutoPaper uses Resend for verification and password-reset emails.

## Use This Now: No-Domain Testing

1. Create an AutoPaper inbox, for example:

```text
autopaper.official@gmail.com
```

2. Create your Resend account using that inbox.
3. Create an API key at `https://resend.com/api-keys`.
4. Fill these values in `.env.local`:

```env
RESEND_API_KEY=re_your_actual_key
EMAIL_FROM="AutoPaper <onboarding@resend.dev>"
EMAIL_TEST_RECIPIENT=autopaper.official@gmail.com
NEXT_PUBLIC_CONTACT_EMAIL=autopaper.official@gmail.com
```

`EMAIL_TEST_RECIPIENT` must exactly match the email connected to your Resend
account.

While this value is configured:

- Only that email can register.
- Verification emails go only to that inbox.
- Password-reset emails go only to that inbox.
- Other registrations receive a private-testing message.

This lets you test authentication without owning a domain. It is not suitable
for a public launch because normal users cannot receive emails.

## Test Locally

Run:

```powershell
corepack pnpm dev
```

Open:

```text
http://localhost:3000/register
```

Register using exactly the address configured in `EMAIL_TEST_RECIPIENT`.

## Switch to Public Email Later

After buying a domain:

1. Add the domain or a sending subdomain to Resend.
2. Add Resend's DKIM, SPF, and MX records to your DNS provider.
3. Wait until Resend shows the domain as `verified`.
4. Change:

```env
EMAIL_FROM="AutoPaper <noreply@yourdomain.com>"
```

5. Remove or empty:

```env
EMAIL_TEST_RECIPIENT=
```

6. Set your deployed URL:

```env
NEXT_PUBLIC_APP_URL=https://your-production-url.com
```

Restart or redeploy. Public verification email then works without any code
changes.

Official Resend domain documentation:

```text
https://resend.com/docs/dashboard/domains/introduction
```

## Complete Local Environment

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-generated-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=re_your_actual_key
EMAIL_FROM="AutoPaper <onboarding@resend.dev>"
EMAIL_TEST_RECIPIENT=autopaper.official@gmail.com
NEXT_PUBLIC_CONTACT_EMAIL=autopaper.official@gmail.com
```

Then create the database indexes:

```powershell
corepack pnpm db:indexes
```

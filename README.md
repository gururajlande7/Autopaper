# AutoPaper

AutoPaper is a production-oriented full-stack Next.js application that creates
structured Class 10 question papers from MongoDB and exports print-ready A4
PDFs.

Read the detailed architecture and function reference in
[`docs/PROJECT_GUIDE.md`](docs/PROJECT_GUIDE.md).

Email and DNS setup is documented in
[`docs/EMAIL_SETUP.md`](docs/EMAIL_SETUP.md).

## Features

- Full question papers and chapter-wise 15-mark tests
- Science I, Science II, Mathematics I, and Mathematics II
- Easy, medium, and hard adaptive difficulty profiles
- Responsive multi-page A4 preview and browser PDF export
- Custom school name, exam date, and logo
- Registration and email verification
- JWT sessions in secure HttpOnly cookies
- Login, logout, resend verification, forgot password, and reset password
- Five successful papers per verified user per UTC day
- API validation, rate limiting, structured logging, and health checks

## Requirements

- Node.js 20.9 or newer
- pnpm through Corepack
- MongoDB Atlas or another production MongoDB deployment
- A Resend account and verified sending domain

## Environment

Fill in the ignored `.env.local` file:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=re_xxxxxxxxx
EMAIL_FROM="AutoPaper <noreply@your-domain.com>"
NEXT_PUBLIC_CONTACT_EMAIL=you@example.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Use the same values in your hosting provider, replacing
`NEXT_PUBLIC_APP_URL` with the production HTTPS URL.

Create a GA4 web data stream, copy its `G-...` measurement ID, and place it in
`NEXT_PUBLIC_GA_MEASUREMENT_ID`. Google Analytics is loaded only in production.

## Commands

```powershell
corepack pnpm install
corepack pnpm dev
corepack pnpm check
corepack pnpm db:indexes
corepack pnpm start
```

Run `db:indexes` against each production database after configuring
`MONGODB_URI`.

## Authentication Flow

1. A user registers with name, email, and password.
2. The password is hashed with Node.js `scrypt`.
3. AutoPaper emails a 24-hour verification link through Resend.
4. The user explicitly confirms the link.
5. AutoPaper creates a seven-day signed JWT in an HttpOnly cookie.
6. Protected pages and APIs validate the JWT and current user session version.
7. Password reset links expire after one hour and invalidate older sessions.

## Deployment Checklist

1. Import the production `questions` collection.
2. Add every environment variable to the hosting provider.
3. Verify the email sending domain in Resend.
4. Run `corepack pnpm db:indexes`.
5. Run `corepack pnpm check`.
6. Deploy the entire project directory.
7. Confirm `/api/health` returns HTTP 200.
8. Register and verify a real test account.
9. Test login, logout, password reset, generation, and PDF printing.

The short burst limiter is process-local. The daily user quota is stored in
MongoDB and works across multiple application instances.

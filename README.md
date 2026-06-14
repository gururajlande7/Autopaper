# AutoPaper

AutoPaper is a full-stack Next.js application that generates structured Class
10 question papers from MongoDB and exports them as print-ready A4 PDFs.

For the architecture, request flow, database schema, and function-by-function
reference, read [`docs/PROJECT_GUIDE.md`](docs/PROJECT_GUIDE.md).

It supports full papers and chapter-wise 15-mark tests. Each chapter test
contains three MCQs, two objective questions, two 2-mark questions, and two
3-mark questions.

Difficulty profiles prefer these mixes and automatically use available
questions from another level when a preferred level is unavailable:

- Easy: 80% easy, 20% medium
- Medium: 20% easy, 60% medium, 20% hard
- Hard: 15% easy, 30% medium, 55% hard

Question records may use either internal subjects such as `math-1` or display
subjects such as `Mathematics - I`. Image flags including `yes`, `no`, `true`,
and `false` are normalized while generating.

## Requirements

- Node.js 20 or newer
- pnpm via Corepack
- MongoDB Atlas or another production MongoDB deployment

## Environment

Copy `.env.example` to `.env.local` for local development. Never commit real
credentials.

```env
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_CONTACT_EMAIL=you@example.com
```

`MONGODB_URI` is mandatory. The application intentionally has no hardcoded
local MongoDB fallback.

## Commands

```bash
corepack pnpm install
corepack pnpm dev
corepack pnpm check
corepack pnpm db:indexes
corepack pnpm start
```

Run `db:indexes` once against each production database after setting
`MONGODB_URI`.

## Deployment Checklist

1. Import the `questions` collection into the production database.
2. Configure all environment variables in the hosting provider.
3. Run `pnpm db:indexes`.
4. Run `pnpm check`.
5. Deploy this project directory.
6. Verify `/api/health` returns HTTP 200.
7. Generate and print one paper for every supported subject.

## Current Scope

Authentication is intentionally not enabled yet. The old `/login` and
`/signin` routes redirect to the paper builder. Add authentication before
introducing private question banks, user accounts, or institution-specific
data.

Paper generation is limited to five successful papers per client IP per UTC
day. The quota is stored in MongoDB, works across multiple application
instances, and expires automatically through a TTL index. Run `db:indexes`
after deployment so that expiry index exists.

The short burst limiter is process-local. For horizontally scaled deployment,
replace that additional burst protection with Redis or a provider-managed rate
limiter.
# Autopaper

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BackgroundPattern } from '@/components/background-pattern'
import { Header } from '@/components/header'
import { getCurrentUser } from '@/lib/server/auth'

export const metadata = {
  title: 'Your Account',
}

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?next=/account')
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <BackgroundPattern />
      <Header />
      <section className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Account
          </p>
          <h1 className="mt-2 text-3xl font-bold">{user.name}</h1>
          <dl className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-muted p-4">
              <dt className="text-xs font-bold uppercase text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 break-all font-medium">{user.email}</dd>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <dt className="text-xs font-bold uppercase text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1 font-medium text-green-700">
                Email verified
              </dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="rounded-xl bg-primary px-5 py-3 font-semibold text-white"
              href="/create"
            >
              Create a paper
            </Link>
            <Link
              className="rounded-xl border border-border px-5 py-3 font-semibold"
              href="/forgot-password"
            >
              Reset password
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

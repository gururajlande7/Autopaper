import Link from 'next/link'
import { Mail } from 'lucide-react'
import { BackgroundPattern } from '@/components/background-pattern'
import { Header } from '@/components/header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Contact',
  description: 'Contact AutoPaper.',
}

export default function ContactPage() {
  const contactEmails = Array.from(
    new Set(
      [process.env.NEXT_PUBLIC_CONTACT_EMAIL, 'riteshworking247@gmail.com'].filter(
        Boolean,
      ) as string[],
    ),
  )

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <BackgroundPattern />
      <Header />

      <section className="relative mx-auto flex min-h-[calc(100svh-65px)] max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full rounded-3xl border border-border bg-card p-7 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-4xl font-bold">Contact AutoPaper</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Send feedback, report a problem, or ask about adding another
            subject.
          </p>

          {contactEmails.length > 0 ? (
            <div className="mt-7 flex flex-col items-center gap-3">
              {contactEmails.map((email) => (
                <a
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-auto min-h-11 max-w-full bg-primary px-5 py-3 text-sm text-white sm:px-7 sm:text-base',
                  )}
                  href={`mailto:${email}?subject=AutoPaper enquiry`}
                  key={email}
                >
                  <span className="break-all">Email {email}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-7 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
              Contact email is not configured yet. Set{' '}
              <code>NEXT_PUBLIC_CONTACT_EMAIL</code> in the deployment
              environment.
            </p>
          )}

          <div className="mt-8">
            <Link
              className="font-semibold text-primary hover:underline"
              href="/create"
            >
              Return to the paper builder
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

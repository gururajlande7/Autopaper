import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BackgroundPattern } from '@/components/background-pattern'

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <BackgroundPattern />
      <section className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <Link className="mb-7 flex items-center justify-center gap-3" href="/">
          <Image
            alt="AutoPaper"
            className="h-12 w-12 rounded-xl object-contain"
            height={48}
            priority
            src="/autopaper-logo.png"
            width={48}
          />
          <span className="text-2xl font-bold text-primary">AutoPaper</span>
        </Link>
        <h1 className="text-center text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {description}
        </p>
        <div className="mt-7">{children}</div>
      </section>
    </main>
  )
}

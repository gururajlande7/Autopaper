import Link from 'next/link'
import { BookOpen, FileCheck2, ShieldCheck } from 'lucide-react'
import { BackgroundPattern } from '@/components/background-pattern'
import { Header } from '@/components/header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'About',
  description: 'Learn why AutoPaper was built and what it currently supports.',
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <BackgroundPattern />
      <Header />

      <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            About AutoPaper
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Less formatting. More teaching.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            AutoPaper is an early-stage tool for generating structured Class 10
            question papers from a curated question bank and exporting them as
            print-ready A4 PDFs.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-6">
            <BookOpen className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-xl font-bold">Curriculum focused</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Current support covers Science and Technology I and II, and
              Mathematics I.
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6">
            <FileCheck2 className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-xl font-bold">Structured generation</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Paper blueprints, mark values, question types, and chapter quotas
              guide each generated paper.
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-xl font-bold">Private customization</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              School names and uploaded logos stay in the browser and are used
              only to prepare the printable document.
            </p>
          </article>
        </div>

        <div className="mt-12 rounded-3xl bg-primary px-6 py-10 text-center text-white">
          <h2 className="text-3xl font-bold">Create a paper now</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Generate, inspect, and save a complete A4 question paper.
          </p>
          <Link
            href="/create"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'mt-6 h-11 bg-white px-7 text-primary hover:bg-white/90',
            )}
          >
            Open paper builder
          </Link>
        </div>
      </section>
    </main>
  )
}

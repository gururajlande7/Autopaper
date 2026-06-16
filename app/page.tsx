'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  FileDown,
  SlidersHorizontal,
  Zap,
} from 'lucide-react'
import { BackgroundPattern } from '@/components/background-pattern'
import { Header } from '@/components/header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const AtomCanvas = dynamic(
  () =>
    import('@/components/atom-3d').then((module) => ({
      default: module.AtomCanvas,
    })),
  { ssr: false },
)

const steps = [
  {
    icon: BookOpen,
    title: 'Choose a subject',
    copy: 'Select Science I, Science II, Mathematics I, or Mathematics II.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Generate the paper',
    copy: 'AutoPaper applies the configured blueprint and chapter quotas.',
  },
  {
    icon: FileDown,
    title: 'Review and print',
    copy: 'Preview every A4 page, then print or save the paper as a PDF.',
  },
]

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <BackgroundPattern />
      <Header />

      <section className="relative flex overflow-hidden py-9 sm:min-h-[calc(100svh-73px)] sm:items-center sm:py-10">
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-5 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8">
          <div className="max-w-2xl min-w-0 text-left">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary sm:text-sm sm:tracking-[0.18em]">
              Class 10 paper generator
            </p>
            <h1 className="max-w-full text-3xl font-bold leading-[1.08] tracking-tight text-foreground min-[380px]:text-4xl sm:text-5xl lg:text-6xl">
              Create structured question papers{' '}
              <span className="text-accent">in minutes</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
              Generate curriculum-aligned papers from your question bank,
              review the A4 layout, and save a clean print-ready PDF.
            </p>
            <div className="mt-6 grid gap-3 min-[390px]:grid-cols-2 sm:mt-7 sm:flex sm:flex-wrap">
              <Link
                href="/create"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-11 bg-primary px-4 text-sm text-white hover:bg-primary/90 sm:px-6 sm:text-base',
                )}
              >
                Create a question paper
              </Link>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'h-11 border-primary px-4 text-sm text-primary sm:px-6 sm:text-base',
                )}
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="mx-auto h-[190px] w-full max-w-[300px] sm:h-[300px] sm:max-w-[480px] lg:h-[430px]">
            <AtomCanvas />
          </div>
        </div>
      </section>

      <section className="relative border-y border-border bg-card/55 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mt-2 text-muted-foreground">
              A focused workflow from question bank to printable paper.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, copy }, index) => (
              <article
                className="rounded-2xl border border-border bg-card p-5"
                key={title}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Subjects currently available
            </h2>
            <p className="mt-2 text-muted-foreground">
              More subjects can be added as their question banks are prepared.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Science</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Science and Technology I and II with section-based paper
                patterns.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                Chapter-aware question selection
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold">Mathematics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Mathematics I and II with activities, objectives, and
                structured mark-based questions.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                KaTeX-ready mathematical formatting
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="relative bg-primary py-12 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Build your first paper
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">
            Generate a paper, inspect every page, and save it as an A4 PDF.
          </p>
          <Link
            href="/create"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'mt-6 h-11 bg-white px-7 text-base font-semibold text-primary hover:bg-white/90',
            )}
          >
            Open paper builder
          </Link>
        </div>
      </section>

      <footer className="relative border-t border-border bg-card/95">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:grid-cols-[1.5fr_auto_auto] md:items-center lg:px-8">
          <div className="flex items-center justify-center gap-3 text-center md:justify-start md:text-left">
            <Image
              alt="AutoPaper"
              className="h-11 w-11 rounded-xl object-contain"
              height={44}
              src="/autopaper-logo.png"
              width={44}
            />
            <div>
              <p className="text-base font-bold text-primary">AutoPaper</p>
              <p className="mt-1 max-w-xs">
                Class 10 question papers, ready for A4 PDF export.
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-5 font-semibold">
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
          <p className="text-center md:text-right">Copyright 2026 AutoPaper</p>
        </div>
      </footer>
    </main>
  )
}

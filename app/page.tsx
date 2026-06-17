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

      <section className="relative flex overflow-hidden py-6 sm:min-h-[calc(100svh-73px)] sm:items-center sm:py-10">
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1.15fr)_minmax(104px,0.85fr)] items-center gap-2 px-4 min-[420px]:gap-4 sm:grid-cols-1 sm:gap-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8">
          <div className="max-w-2xl min-w-0 text-left">
            <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-primary min-[380px]:text-xs sm:mb-3 sm:text-sm sm:tracking-[0.18em]">
              Class 10 paper generator
            </p>
            <h1 className="max-w-full text-[1.65rem] font-bold leading-[1.03] tracking-tight text-foreground min-[360px]:text-3xl min-[420px]:text-4xl sm:text-5xl lg:text-6xl">
              Create structured question papers{' '}
              <span className="text-accent">in minutes</span>
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground min-[380px]:text-sm sm:mt-5 sm:text-lg">
              Generate curriculum-aligned papers from your question bank,
              review the A4 layout, and save a clean print-ready PDF.
            </p>
            <div className="mt-4 grid gap-2 min-[440px]:grid-cols-2 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
              <Link
                href="/create"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-10 bg-primary px-3 text-xs text-white hover:bg-primary/90 sm:h-11 sm:px-6 sm:text-base',
                )}
              >
                <span className="min-[380px]:hidden">Create paper</span>
                <span className="hidden min-[380px]:inline">
                  Create a question paper
                </span>
              </Link>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'h-10 border-primary px-3 text-xs text-primary sm:h-11 sm:px-6 sm:text-base',
                )}
              >
                Learn more
              </Link>
            </div>
          </div>

          <div className="h-[170px] w-full min-w-0 max-w-[190px] justify-self-center min-[380px]:h-[205px] min-[380px]:max-w-[230px] sm:mx-auto sm:h-[300px] sm:max-w-[480px] lg:h-[430px]">
            <AtomCanvas />
          </div>
        </div>
      </section>

      <section className="relative border-y border-border bg-card/55 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center sm:mb-9">
            <h2 className="text-2xl font-bold text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground sm:max-w-none sm:text-base">
              A focused workflow from question bank to printable paper.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {steps.map(({ icon: Icon, title, copy }, index) => (
              <article
                className="rounded-2xl border border-border bg-card p-4 sm:p-5"
                key={title}
              >
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary sm:p-2.5">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground sm:text-lg">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center sm:mb-9">
            <h2 className="text-2xl font-bold text-foreground sm:text-4xl">
              Subjects currently available
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground sm:max-w-none sm:text-base">
              More subjects can be added as their question banks are prepared.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-3 md:grid-cols-2 md:gap-4">
            <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 sm:mb-4 sm:h-11 sm:w-11">
                <Zap className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg font-bold sm:text-xl">Science</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Science and Technology I and II with section-based paper
                patterns.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                Chapter-aware question selection
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 sm:mb-4 sm:h-11 sm:w-11">
                <BarChart3 className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg font-bold sm:text-xl">Mathematics</h3>
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

      <section className="relative bg-primary py-10 text-white sm:py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-4xl">
            Build your first paper
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            Generate a paper, inspect every page, and save it as an A4 PDF.
          </p>
          <Link
            href="/create"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'mt-5 h-10 bg-white px-5 text-sm font-semibold text-primary hover:bg-white/90 sm:mt-6 sm:h-11 sm:px-7 sm:text-base',
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

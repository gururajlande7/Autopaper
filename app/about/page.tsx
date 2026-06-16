import Link from 'next/link'
import { Mail } from 'lucide-react'
import { BackgroundPattern } from '@/components/background-pattern'
import { Header } from '@/components/header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const founders = [
  {
    name: 'Gururaj Lande',
    role: 'First Year, Computer Engineering',
    email: 'gururajairaj20@gmail.com',
    linkedin: 'https://www.linkedin.com/in/gururaj-lande',
    github: 'https://github.com/gururajlande7',
  },
  {
    name: 'Ritesh Gabale',
    role: 'First Year, Computer Engineering',
    email: 'riteshworking247@gmail.com',
    linkedin: 'https://www.linkedin.com/in/ritesh-gabale-59a2b5365',
    github: 'https://github.com/Ritesh007-max',
  },
]

export const metadata = {
  title: 'About',
  description: 'Learn why AutoPaper was built and who is building it.',
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <BackgroundPattern />
      <Header />

      <section className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            About AutoPaper
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Built from a real student problem.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            AutoPaper helps students and teachers generate customized question
            papers in minutes, filtered by chapter, marks, and difficulty, from
            a question bank built for SSC Maharashtra Board and CBSE Class 10.
          </p>
        </div>

        <div className="mt-10 space-y-5 rounded-3xl border border-border bg-card p-6 leading-relaxed shadow-sm sm:p-8">
          <p>
            Creating a good practice paper sounds simple: pick some questions,
            arrange them, print. But anyone who has actually done it knows it
            is anything but. Teachers spend hours going through textbooks,
            balancing marks, ensuring chapter coverage, and formatting
            everything properly. Students preparing on their own rarely have
            access to varied question sets beyond what is in their textbook.
            For SSC students, where every mark counts, that gap in practice
            can matter.
          </p>

          <p>
            We went through SSC ourselves. We knew the pressure of board exams,
            the lack of good practice material, and how much time gets wasted
            on things that should just work. When we got into engineering and
            learned to build software, this was the first real problem we
            wanted to solve, not because it was a great business idea, but
            because we had lived it.
          </p>

          <p>
            AutoPaper has no corporate agenda or grand mission statement. We
            saw a problem we understood personally, and we built something to
            fix it.
          </p>
        </div>

        <section className="mt-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Founders
            </p>
            <h2 className="mt-2 text-3xl font-bold">Who is building it</h2>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {founders.map((founder) => (
              <article
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
                key={founder.name}
              >
                <h3 className="text-2xl font-bold">{founder.name}</h3>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {founder.role}
                </p>

                <div className="mt-5 space-y-3 text-sm">
                  {'email' in founder && founder.email && (
                    <a
                      className="flex min-w-0 items-center gap-2 text-primary hover:underline"
                      href={`mailto:${founder.email}`}
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="break-all">{founder.email}</span>
                    </a>
                  )}
                  <a
                    className="flex min-w-0 items-start gap-2 text-primary hover:underline"
                    href={founder.linkedin}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="shrink-0 font-semibold">LinkedIn:</span>
                    <span className="break-all">{founder.linkedin}</span>
                  </a>
                  <a
                    className="flex min-w-0 items-start gap-2 text-primary hover:underline"
                    href={founder.github}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="shrink-0 font-semibold">GitHub:</span>
                    <span className="break-all">{founder.github}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

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

'use client'

import { ChangeEvent, useRef, useState } from 'react'
import {
  AlertCircle,
  FileImage,
  FileText,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type {
  Difficulty,
  GeneratedPaper,
  PaperMode,
  Subject,
} from '@/lib/paper/types'
import { getChapterCount, PAPER_PATTERNS } from '@/lib/paper/patterns'
import { PaperPreview } from './paper-preview'

const subjectOptions: Array<
  | { value: Subject; label: string; disabled?: false }
  | { value: string; label: string; disabled: true }
> = [
  ...(['science1', 'science2', 'math-1', 'math-2'] as Subject[]).map(
    (value) => ({
      value,
      label: PAPER_PATTERNS[value].label,
    }),
  ),
  { value: 'history', label: 'History (Coming soon)', disabled: true },
  { value: 'geography', label: 'Geography (Coming soon)', disabled: true },
]
const defaultLogo = '/autopaper-logo.png'
const acceptedLogoTypes = ['image/jpeg', 'image/png', 'image/webp']
const maximumLogoSize = 2 * 1024 * 1024

export function PaperBuilder() {
  const [subject, setSubject] = useState<Subject>('science1')
  const [paperMode, setPaperMode] = useState<PaperMode>('full')
  const [chapter, setChapter] = useState(1)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [schoolName, setSchoolName] = useState('AutoPaper Academy')
  const [examDate, setExamDate] = useState('')
  const [logoUrl, setLogoUrl] = useState(defaultLogo)
  const [logoName, setLogoName] = useState('AutoPaper logo')
  const [logoError, setLogoError] = useState('')
  const [paper, setPaper] = useState<GeneratedPaper | null>(null)
  const [dailyRemaining, setDailyRemaining] = useState<number | null>(null)
  const [dailyLimit, setDailyLimit] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setLogoError('')

    if (!acceptedLogoTypes.includes(file.type)) {
      setLogoError('Use a PNG, JPEG, or WebP image.')
      event.target.value = ''
      return
    }

    if (file.size > maximumLogoSize) {
      setLogoError('Logo must be smaller than 2 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        setLogoError('Unable to read that logo.')
        return
      }

      setLogoUrl(reader.result)
      setLogoName(file.name)
    })

    reader.addEventListener('error', () => {
      setLogoError('Unable to read that logo.')
    })

    reader.readAsDataURL(file)
  }

  function resetLogo() {
    setLogoUrl(defaultLogo)
    setLogoName('AutoPaper logo')
    setLogoError('')

    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }

  async function handleGenerate() {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          mode: paperMode,
          chapter: paperMode === 'chapter-test' ? chapter : undefined,
          difficulty,
        }),
      })

      const result = (await response.json()) as {
        paper?: GeneratedPaper
        error?: string
        dailyRemaining?: number
        dailyLimit?: number
      }

      if (typeof result.dailyRemaining === 'number') {
        setDailyRemaining(result.dailyRemaining)
      }
      if (typeof result.dailyLimit === 'number') {
        setDailyLimit(result.dailyLimit)
      }

      if (!response.ok || !result.paper) {
        throw new Error(result.error || 'Paper generation failed.')
      }

      setPaper(result.paper)
    } catch (requestError) {
      setPaper(null)
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Paper generation failed.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-6 px-3 py-8 sm:px-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-8 xl:px-8 xl:py-12">
        <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-sm xl:sticky xl:top-24">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create a paper</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Uses the same blueprint and chapter quotas as AutoPaper.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <label className="block space-y-2">
              <span className="text-sm font-semibold">Paper type</span>
              <select
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                onChange={(event) =>
                  setPaperMode(event.target.value as PaperMode)
                }
                value={paperMode}
              >
                <option value="full">Full question paper</option>
                <option value="chapter-test">15-mark chapter test</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold">Subject</span>
              <select
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                onChange={(event) => {
                  setSubject(event.target.value as Subject)
                  setChapter(1)
                }}
                value={subject}
              >
                {subjectOptions.map((option) => (
                  <option
                    disabled={option.disabled}
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {paperMode === 'chapter-test' && (
              <label className="block space-y-2">
                <span className="text-sm font-semibold">Chapter</span>
                <select
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  onChange={(event) => setChapter(Number(event.target.value))}
                  value={chapter}
                >
                  {Array.from(
                    { length: getChapterCount(subject) },
                    (_, index) => index + 1,
                  ).map((chapterNumber) => (
                    <option key={chapterNumber} value={chapterNumber}>
                      Chapter {chapterNumber}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block space-y-2">
              <span className="text-sm font-semibold">Difficulty</span>
              <select
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                onChange={(event) =>
                  setDifficulty(event.target.value as Difficulty)
                }
                value={difficulty}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <span className="block text-xs text-muted-foreground">
                Uses the selected mix and fills from other levels when needed.
              </span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold">School name</span>
              <input
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                maxLength={80}
                onChange={(event) => setSchoolName(event.target.value)}
                placeholder="AutoPaper Academy"
                value={schoolName}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold">Exam date</span>
              <input
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                onChange={(event) => setExamDate(event.target.value)}
                type="date"
                value={examDate}
              />
            </label>

            <div className="space-y-2 sm:col-span-3 xl:col-span-1">
              <span className="text-sm font-semibold">Paper logo</span>
              <div className="flex items-center gap-3 rounded-xl border border-input bg-background p-3">
                {/* Logo can be a local data URL selected by the user. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Selected paper logo"
                  className="h-12 w-12 shrink-0 rounded-lg border border-border bg-white object-contain p-1"
                  src={logoUrl}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{logoName}</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPEG, or WebP. Maximum 2 MB.
                  </p>
                </div>
              </div>

              <input
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handleLogoChange}
                ref={logoInputRef}
                type="file"
              />

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="w-full"
                  onClick={() => logoInputRef.current?.click()}
                  type="button"
                  variant="outline"
                >
                  <FileImage />
                  Upload logo
                </Button>
                <Button
                  className="w-full"
                  disabled={logoUrl === defaultLogo}
                  onClick={resetLogo}
                  type="button"
                  variant="ghost"
                >
                  <RotateCcw />
                  Reset
                </Button>
              </div>

              {logoError && (
                <p className="text-xs font-medium text-destructive" role="alert">
                  {logoError}
                </p>
              )}
            </div>

            {error && (
              <div
                className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive sm:col-span-3 xl:col-span-1"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              className="h-12 w-full bg-primary text-white hover:bg-primary/90 sm:col-span-3 xl:col-span-1"
              disabled={isLoading}
              onClick={handleGenerate}
              type="button"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText />
                  {paperMode === 'chapter-test'
                    ? 'Generate 15-mark test'
                    : 'Generate question paper'}
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground sm:col-span-3 xl:col-span-1">
              {dailyRemaining === null
                ? 'Start with 2 free papers. Verified accounts get 5 per day.'
                : `${dailyRemaining} of ${dailyLimit ?? 5} paper generations remaining today.`}
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          {!paper && !isLoading && (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 text-center">
              <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
                <FileText className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold">Your A4 preview appears here</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Generate a full paper or a chapter-wise 15-mark test. It will
                be paginated into print-ready A4 sheets automatically.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-border bg-card">
              <div className="text-center">
                <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-primary" />
                <p className="mt-3 font-medium">Building your paper...</p>
              </div>
            </div>
          )}

          {paper && !isLoading && (
            <PaperPreview
              examDate={examDate}
              logoUrl={logoUrl}
              paper={paper}
              schoolName={schoolName}
            />
          )}
        </div>
      </section>
    </>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PaperPreview } from '@/components/paper/paper-preview'
import type { GeneratedPaper } from '@/lib/paper/types'

const mobilePrintStorageKey = 'autopaper.printPayload'

type StoredPrintPayload = {
  paper: GeneratedPaper
  examDate: string
  schoolName: string
  logoUrl: string
}

export default function PaperPrintPage() {
  const [payload, setPayload] = useState<StoredPrintPayload | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    window.setTimeout(() => {
      const storedPayload = sessionStorage.getItem(mobilePrintStorageKey)

      if (!storedPayload) {
        setError('No paper was found for printing. Generate a paper first.')
        return
      }

      try {
        setPayload(JSON.parse(storedPayload) as StoredPrintPayload)
      } catch {
        setError('The saved paper could not be opened. Generate it again.')
      }
    }, 0)
  }, [])

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div className="max-w-sm rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Unable to open paper</h1>
          <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          <Link
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
            href="/create"
          >
            Go back to builder
          </Link>
        </div>
      </main>
    )
  }

  if (!payload) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Preparing your PDF...
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white py-2">
      <PaperPreview
        autoPrint
        examDate={payload.examDate}
        logoUrl={payload.logoUrl}
        paper={payload.paper}
        printOnly
        schoolName={payload.schoolName}
      />
    </main>
  )
}

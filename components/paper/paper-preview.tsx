'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { GeneratedPaper, PaperQuestion } from '@/lib/paper/types'
import { PAPER_PATTERNS } from '@/lib/paper/patterns'

type PaperPreviewProps = {
  paper: GeneratedPaper
  examDate: string
  schoolName: string
  logoUrl: string
  autoPrint?: boolean
  printOnly?: boolean
}

const mobilePrintStorageKey = 'autopaper.printPayload'

function HtmlText({
  className,
  html,
}: {
  className?: string
  html: string
}) {
  return (
    <div
      className={className}
      data-math
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function QuestionItem({
  number,
  question,
}: {
  number: number
  question: PaperQuestion
}) {
  const isMultipleChoice =
    question.questionType === 'MCQ' || question.questionType === '1a'

  return (
    <div className="paper-item">
      <HtmlText
        className="paper-question-text"
        html={`(${number})&nbsp; ${question.questionText}`}
      />

      {isMultipleChoice &&
        question.options.slice(0, 4).map((option, optionIndex) => (
          <HtmlText
            className="paper-question-text paper-option"
            html={`(${String.fromCharCode(65 + optionIndex)})&nbsp; ${option}`}
            key={`${question.id}-${optionIndex}`}
          />
        ))}

      {question.hasImage === 'yes' && question.image && (
        // Question-bank images may be hosted on multiple external providers.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`Illustration for question ${number}`}
          className="paper-question-image"
          src={question.image}
        />
      )}
    </div>
  )
}

function waitForImages(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll('img'))

  return Promise.all(
    images.map(async (image) => {
      if (image.complete) {
        return
      }

      await new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve(), { once: true })
        image.addEventListener('error', () => resolve(), { once: true })
      })
    }),
  )
}

export function PaperPreview({
  autoPrint = false,
  paper,
  examDate,
  schoolName,
  logoUrl,
  printOnly = false,
}: PaperPreviewProps) {
  const sourceRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLDivElement>(null)
  const printRootRef = useRef<HTMLDivElement>(null)
  const previewViewportRef = useRef<HTMLDivElement>(null)
  const hasAutoPrintedRef = useRef(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let resizeObserver: ResizeObserver | null = null

    async function paginate() {
      const source = sourceRef.current
      const pages = pagesRef.current
      const previewViewport = previewViewportRef.current

      if (!source || !pages || !previewViewport) {
        return
      }

      const pageContainer = pages
      setIsReady(false)
      pageContainer.replaceChildren()

      const { default: renderMathInElement } = await import(
        'katex/contrib/auto-render'
      )

      source.querySelectorAll<HTMLElement>('[data-math]').forEach((element) => {
        renderMathInElement(element, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
          strict: false,
          trust: false,
        })
      })

      await document.fonts.ready
      await waitForImages(source)

      if (cancelled) {
        return
      }

      const items = Array.from(source.children).map(
        (item) => item.cloneNode(true) as HTMLElement,
      )
      let pageNumber = 0
      let currentPage: HTMLElement
      let currentContent: HTMLElement

      function createPage() {
        pageNumber += 1
        currentPage = document.createElement('section')
        currentPage.className = 'paper-a4-page'

        if (pageNumber === 1) {
          const header = document.createElement('header')
          header.className = 'paper-exam-header'

          const logo = document.createElement('img')
          logo.className = 'paper-brand-logo'
          logo.src = logoUrl
          logo.alt = `${schoolName || 'School'} logo`

          const titleBlock = document.createElement('div')
          titleBlock.className = 'paper-title-block'

          const school = document.createElement('p')
          school.className = 'paper-school-name'
          school.textContent = schoolName || 'AutoPaper Academy'

          const title = document.createElement('h1')
          title.textContent = PAPER_PATTERNS[paper.subject].label

          const subtitle = document.createElement('p')
          subtitle.textContent =
            paper.mode === 'chapter-test'
              ? `Chapter ${paper.chapter} | 15-Mark Test | ${paper.difficulty} difficulty`
              : `Question Paper | ${paper.difficulty} difficulty`

          titleBlock.append(school, title, subtitle)

          const examMeta = document.createElement('div')
          examMeta.className = 'paper-exam-meta'

          const date = document.createElement('span')
          date.textContent = `Date: ${examDate || '____________'}`

          const marks = document.createElement('span')
          marks.textContent = `Marks: ${paper.totalMarks}`

          examMeta.append(date, marks)
          header.append(logo, titleBlock, examMeta)
          currentPage.appendChild(header)
        }

        currentContent = document.createElement('div')
        currentContent.className = 'paper-page-content'
        currentPage.appendChild(currentContent)
        const pageFrame = document.createElement('div')
        pageFrame.className = 'paper-page-frame'
        pageFrame.appendChild(currentPage)
        pageContainer.appendChild(pageFrame)
      }

      createPage()

      items.forEach((item) => {
        currentContent.appendChild(item)

        if (currentPage.scrollHeight <= currentPage.clientHeight) {
          return
        }

        currentContent.removeChild(item)

        let heading: Element | null = null
        const previousItem = currentContent.lastElementChild

        if (previousItem?.classList.contains('paper-section-heading')) {
          heading = previousItem
          currentContent.removeChild(previousItem)
        }

        createPage()

        if (heading) {
          currentContent.appendChild(heading)
        }

        currentContent.appendChild(item)

        if (currentPage.scrollHeight > currentPage.clientHeight) {
          item.classList.add('paper-item-oversized')
        }
      })

      const updatePreviewScale = () => {
        const a4WidthInPixels = (210 / 25.4) * 96
        const availableWidth = Math.max(
          previewViewport.getBoundingClientRect().width - 2,
          1,
        )
        const scale = Math.min(1, availableWidth / a4WidthInPixels)

        pageContainer.style.setProperty('--paper-scale', String(scale))
        pageContainer.style.setProperty(
          '--paper-frame-width',
          `${a4WidthInPixels * scale}px`,
        )
        pageContainer.style.setProperty(
          '--paper-frame-height',
          `${((297 / 25.4) * 96) * scale}px`,
        )
      }

      updatePreviewScale()
      resizeObserver = new ResizeObserver(updatePreviewScale)
      resizeObserver.observe(previewViewport)
      setIsReady(true)
    }

    void paginate()

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
    }
  }, [examDate, logoUrl, paper, schoolName])

  const handlePrint = useCallback(async () => {
    const printRoot = printRootRef.current

    if (!printRoot) {
      return
    }

    const shouldUsePrintPage =
      !printOnly &&
      (window.matchMedia('(max-width: 768px)').matches ||
        navigator.maxTouchPoints > 0)

    if (shouldUsePrintPage) {
      sessionStorage.setItem(
        mobilePrintStorageKey,
        JSON.stringify({
          examDate,
          logoUrl,
          paper,
          schoolName,
        }),
      )
      window.location.assign('/paper-print')
      return
    }

    const printClone = printRoot.cloneNode(true) as HTMLElement
    printClone.classList.add('paper-print-clone')
    document.body.appendChild(printClone)

    const cleanup = () => {
      document.body.classList.remove('paper-printing')
      printClone.remove()
    }

    document.body.classList.add('paper-printing')
    await document.fonts.ready
    await waitForImages(printClone)

    window.addEventListener('afterprint', cleanup, { once: true })
    window.print()
    window.setTimeout(cleanup, 10_000)
  }, [examDate, logoUrl, paper, printOnly, schoolName])

  useEffect(() => {
    if (!autoPrint || !isReady || hasAutoPrintedRef.current) {
      return
    }

    hasAutoPrintedRef.current = true
    const timeout = window.setTimeout(() => {
      void handlePrint()
    }, 400)

    return () => window.clearTimeout(timeout)
  }, [autoPrint, handlePrint, isReady])

  return (
    <div className="paper-preview-shell">
      {!printOnly && (
        <div className="paper-toolbar">
          <div>
            <p className="paper-toolbar-title">
              {PAPER_PATTERNS[paper.subject].label}
            </p>
            <p className="paper-toolbar-copy">
              <span className="capitalize">{paper.difficulty}</span> difficulty
              {' | '}
              {paper.mode === 'chapter-test' && (
                <>Chapter {paper.chapter} | 15 marks | </>
              )}
              {paper.sections.reduce(
                (total, section) => total + section.questions.length,
                0,
              )}{' '}
              questions across {paper.sections.length} sections
            </p>
          </div>

          <button
            className="paper-print-button"
            disabled={!isReady}
            onClick={handlePrint}
            type="button"
          >
            {isReady ? 'Print / Save PDF' : 'Preparing pages...'}
          </button>
        </div>
      )}

      <div
        className="paper-print-root"
        ref={(element) => {
          printRootRef.current = element
          previewViewportRef.current = element
        }}
      >
        <div className="paper-pages" ref={pagesRef} />
      </div>

      <div aria-hidden className="paper-source" ref={sourceRef}>
        <div className="paper-item paper-instructions">
          <h2>General Instructions</h2>
          <ol>
            <li>All questions are compulsory unless internal choice is given.</li>
            <li>
              Attempt only the required number of questions mentioned in each
              section.
            </li>
            <li>Figures to the right indicate full marks.</li>
            <li>
              Write answers neatly and show necessary steps wherever required.
            </li>
          </ol>
        </div>

        {paper.sections.map((section) => (
          <Fragment key={`${section.questionType}-section`}>
            <h2 className="paper-item paper-section-heading">
              <span>{section.title}</span>
              {section.instruction && <small>{section.instruction}</small>}
            </h2>

            {section.questions.map((question, index) => (
              <QuestionItem
                key={question.id}
                number={index + 1}
                question={question}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

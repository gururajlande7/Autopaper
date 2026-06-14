export const SUBJECTS = ['science1', 'science2', 'math-1', 'math-2'] as const

export type Subject = (typeof SUBJECTS)[number]

export const PAPER_MODES = ['full', 'chapter-test'] as const

export type PaperMode = (typeof PAPER_MODES)[number]

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const

export type Difficulty = (typeof DIFFICULTIES)[number]

export type PaperQuestion = {
  id: string
  questionText: string
  questionType: string
  options: string[]
  subject: string
  chapter: number
  grade: number
  chapterName?: string
  difficulty: Difficulty
  marks: number
  category?: number
  hasImage: string
  image?: string
}

export type PaperSection = {
  title: string
  questionType: string
  questions: PaperQuestion[]
}

export type GeneratedPaper = {
  subject: Subject
  mode: PaperMode
  difficulty: Difficulty
  chapter?: number
  generatedAt: string
  totalMarks: number
  sections: PaperSection[]
}

export function isSubject(value: unknown): value is Subject {
  return typeof value === 'string' && SUBJECTS.includes(value as Subject)
}

export function isPaperMode(value: unknown): value is PaperMode {
  return (
    typeof value === 'string' && PAPER_MODES.includes(value as PaperMode)
  )
}

export function isDifficulty(value: unknown): value is Difficulty {
  return (
    typeof value === 'string' &&
    DIFFICULTIES.includes(value as Difficulty)
  )
}

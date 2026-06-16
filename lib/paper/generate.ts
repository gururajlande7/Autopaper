import { connectToDatabase } from '@/lib/db'
import { QuestionModel } from '@/models/question'
import sanitizeHtml from 'sanitize-html'
import { allocateDifficultyCounts } from './difficulty'
import { CHAPTER_TEST_PATTERNS, PAPER_PATTERNS } from './patterns'
import type {
  Difficulty,
  GeneratedPaper,
  PaperMode,
  PaperQuestion,
  PaperSection,
  Subject,
} from './types'

type DatabaseQuestion = Omit<PaperQuestion, 'id'> & {
  _id: { toString(): string }
}

const subjectDatabaseValues: Record<Subject, string[]> = {
  science1: ['science1', 'Science and Technology - I'],
  science2: ['science2', 'Science and Technology - II'],
  'math-1': ['math-1', 'Mathematics - I'],
  'math-2': ['math-2', 'Mathematics - II'],
}

function getSectionInstruction(count: number, attempt = count) {
  if (attempt >= count) {
    return `Attempt all ${count} questions.`
  }

  return `Attempt any ${attempt} of ${count} questions.`
}

export class PaperGenerationError extends Error {
  constructor(
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'PaperGenerationError'
  }
}

function sanitizeQuestionMarkup(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      'b',
      'br',
      'em',
      'i',
      'p',
      'span',
      'strong',
      'sub',
      'sup',
      'u',
    ],
    allowedAttributes: {
      span: ['class'],
    },
  })
}

function normalizeImageUrl(value?: string) {
  if (!value) {
    return undefined
  }

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : undefined
  } catch {
    return undefined
  }
}

function shuffle<T>(items: T[]) {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [
      result[randomIndex],
      result[index],
    ]
  }

  return result
}

function getDifficultySequence(count: number, difficulty: Difficulty) {
  const allocation = allocateDifficultyCounts(count, difficulty)

  return shuffle(
    (Object.entries(allocation) as Array<[Difficulty, number]>).flatMap(
      ([questionDifficulty, questionCount]) =>
        Array.from({ length: questionCount }, () => questionDifficulty),
    ),
  )
}

function selectQuestions(
  allQuestions: PaperQuestion[],
  questionType: string,
  count: number,
  chapterQuota: number[],
  difficulty: Difficulty,
) {
  const candidates = allQuestions.filter(
    (question) => question.questionType === questionType,
  )

  if (candidates.length < count) {
    throw new PaperGenerationError(
      `Not enough ${questionType} questions are available.`,
      { questionType, required: count, available: candidates.length },
    )
  }

  let bestSelection: PaperQuestion[] = []

  for (let attempt = 0; attempt < 100; attempt++) {
    const remainingQuota = [...chapterQuota]
    const selection: PaperQuestion[] = []
    const availableCandidates = shuffle(candidates)

    for (const preferredDifficulty of getDifficultySequence(
      count,
      difficulty,
    )) {
      const fitsChapterQuota = (question: PaperQuestion) => {
        const chapterIndex = question.chapter - 1
        const availableMarks = remainingQuota[chapterIndex]

        return (
          chapterIndex >= 0 &&
          availableMarks !== undefined &&
          question.marks <= availableMarks
        )
      }

      let candidateIndex = availableCandidates.findIndex(
        (question) =>
          question.difficulty === preferredDifficulty &&
          fitsChapterQuota(question),
      )

      if (candidateIndex === -1) {
        candidateIndex = availableCandidates.findIndex(fitsChapterQuota)
      }

      if (candidateIndex === -1) {
        break
      }

      const [question] = availableCandidates.splice(candidateIndex, 1)
      const chapterIndex = question.chapter - 1
      selection.push(question)
      remainingQuota[chapterIndex] -= question.marks
    }

    if (selection.length === count) {
      return selection
    }

    if (selection.length > bestSelection.length) {
      bestSelection = selection
    }
  }

  throw new PaperGenerationError(
    `The chapter quota cannot satisfy the ${questionType} section.`,
    {
      questionType,
      difficulty,
      required: count,
      selected: bestSelection.length,
    },
  )
}

function selectChapterQuestions(
  allQuestions: PaperQuestion[],
  questionType: string,
  count: number,
  difficulty: Difficulty,
) {
  const availableCandidates = shuffle(
    allQuestions.filter((question) => question.questionType === questionType),
  )

  if (availableCandidates.length < count) {
    throw new PaperGenerationError(
      `Not enough ${questionType} questions are available in this chapter.`,
      {
        questionType,
        required: count,
        available: availableCandidates.length,
      },
    )
  }

  return getDifficultySequence(count, difficulty).map(
    (preferredDifficulty) => {
      let candidateIndex = availableCandidates.findIndex(
        (question) => question.difficulty === preferredDifficulty,
      )

      if (candidateIndex === -1) {
        candidateIndex = 0
      }

      const [question] = availableCandidates.splice(candidateIndex, 1)
      return question
    },
  )
}

export async function generatePaper(
  subject: Subject,
  mode: PaperMode = 'full',
  chapter?: number,
  difficulty: Difficulty = 'medium',
): Promise<GeneratedPaper> {
  await connectToDatabase()

  const query =
    mode === 'chapter-test'
      ? { subject: { $in: subjectDatabaseValues[subject] }, chapter }
      : { subject: { $in: subjectDatabaseValues[subject] } }

  const databaseQuestions = await QuestionModel.find(query)
    .select(
      'questionText questionType options subject chapter chapterName grade difficulty marks category hasImage image',
    )
    .maxTimeMS(5_000)
    .limit(5_000)
    .lean<DatabaseQuestion[]>()
    .exec()

  if (!databaseQuestions.length) {
    throw new PaperGenerationError(
      `No questions were found for subject "${subject}".`,
      { subject },
    )
  }

  const questions: PaperQuestion[] = databaseQuestions.map((question) => ({
    id: question._id.toString(),
    questionText: sanitizeQuestionMarkup(question.questionText),
    questionType: question.questionType,
    options: (question.options ?? []).map(sanitizeQuestionMarkup),
    subject: question.subject,
    chapter: question.chapter,
    chapterName: question.chapterName,
    grade: question.grade,
    difficulty: question.difficulty,
    marks: question.marks,
    category: question.category,
    hasImage:
      question.hasImage === 'yes' || question.hasImage === 'true'
        ? 'yes'
        : 'no',
    image: normalizeImageUrl(question.image),
  }))

  const pattern = PAPER_PATTERNS[subject]
  let sections: PaperSection[]

  if (mode === 'chapter-test') {
    const chapterPattern = subject.startsWith('science')
      ? CHAPTER_TEST_PATTERNS.science
      : CHAPTER_TEST_PATTERNS.mathematics

    sections = chapterPattern.map((section) => ({
      title: section.title,
      instruction: getSectionInstruction(section.count, section.attempt),
      questionType: section.questionType,
      questions: selectChapterQuestions(
        questions,
        section.questionType,
        section.count,
        difficulty,
      ),
    }))
  } else {
    sections = pattern.sections.map((section) => ({
      title: section.title,
      instruction: getSectionInstruction(section.count, section.attempt),
      questionType: section.questionType,
      questions: selectQuestions(
        questions,
        section.questionType,
        section.count,
        pattern.chapterQuota,
        difficulty,
      ).reverse(),
    }))

    // The EJS implementation reverses the completed paper before rendering.
    sections.reverse()
  }

  const totalMarks = sections.reduce(
    (paperTotal, section) =>
      paperTotal +
      section.questions.reduce(
        (sectionTotal, question) => sectionTotal + question.marks,
        0,
      ),
    0,
  )

  if (mode === 'chapter-test' && totalMarks !== 15) {
    throw new PaperGenerationError(
      'The selected chapter has incorrectly marked questions and cannot create a 15-mark test.',
      { chapter, expectedMarks: 15, actualMarks: totalMarks },
    )
  }

  return {
    subject,
    mode,
    difficulty,
    chapter: mode === 'chapter-test' ? chapter : undefined,
    generatedAt: new Date().toISOString(),
    totalMarks: mode === 'full' ? 40 : totalMarks,
    sections,
  }
}

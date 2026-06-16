import type { Subject } from './types'

export type PaperPatternSection = {
  questionType: string
  count: number
  attempt?: number
  title: string
}

export type PaperPattern = {
  label: string
  chapterQuota: number[]
  sections: PaperPatternSection[]
}

export const CHAPTER_TEST_PATTERNS: Record<
  'science' | 'mathematics',
  PaperPatternSection[]
> = {
  science: [
    { questionType: 'MCQ', count: 3, title: 'Multiple Choice Questions' },
    { questionType: 'obj', count: 2, title: 'Objective Questions' },
    { questionType: '2m', count: 2, title: 'Answer The Following' },
    { questionType: '3m', count: 2, title: 'Answer The Following' },
  ],
  mathematics: [
    { questionType: '1a', count: 3, title: 'Multiple Choice Questions' },
    { questionType: '1b', count: 2, title: 'Objective Questions' },
    { questionType: '2b', count: 2, title: 'Answer The Following' },
    { questionType: '3b', count: 2, title: 'Answer The Following' },
  ],
}

export function getChapterCount(subject: Subject) {
  return PAPER_PATTERNS[subject].chapterQuota.length
}

export const PAPER_PATTERNS: Record<Subject, PaperPattern> = {
  science1: {
    label: 'Science and Technology - I',
    chapterQuota: [5, 6, 6, 7, 5, 7, 6, 6, 7, 5],
    sections: [
      { questionType: '5m', count: 2, attempt: 1, title: 'Answer The Following' },
      { questionType: '3m', count: 8, attempt: 5, title: 'Answer The Following' },
      { questionType: '2m', count: 5, attempt: 3, title: 'Answer The Following' },
      { questionType: 'gr', count: 3, attempt: 2, title: 'Give Reason' },
      { questionType: 'obj', count: 5, title: 'Objective Questions' },
      { questionType: 'MCQ', count: 5, title: 'Multiple Choice Questions' },
    ],
  },
  science2: {
    label: 'Science and Technology - II',
    chapterQuota: [5, 6, 6, 7, 5, 7, 6, 6, 7, 5],
    sections: [
      { questionType: '5m', count: 2, attempt: 1, title: 'Answer The Following' },
      { questionType: '3m', count: 8, attempt: 5, title: 'Answer The Following' },
      { questionType: '2m', count: 5, attempt: 3, title: 'Answer The Following' },
      { questionType: 'gr', count: 3, attempt: 2, title: 'Give Reason' },
      { questionType: 'obj', count: 5, title: 'Objective Questions' },
      { questionType: 'MCQ', count: 5, title: 'Multiple Choice Questions' },
    ],
  },
  'math-1': {
    label: 'Mathematics - I',
    chapterQuota: [12, 12, 8, 8, 8, 12],
    sections: [
      { questionType: '5', count: 2, attempt: 1, title: 'Answer The Following' },
      { questionType: '4', count: 3, attempt: 2, title: 'Answer The Following' },
      { questionType: '3b', count: 4, attempt: 3, title: 'Answer The Following' },
      { questionType: '3a', count: 2, attempt: 1, title: 'Activity' },
      { questionType: '2b', count: 5, attempt: 3, title: 'Answer The Following' },
      { questionType: '2a', count: 3, attempt: 2, title: 'Activity' },
      { questionType: '1b', count: 4, attempt: 3, title: 'Objective Questions' },
      { questionType: '1a', count: 4, attempt: 2, title: 'Multiple Choice Questions' },
    ],
  },
  'math-2': {
    label: 'Mathematics - II',
    chapterQuota: [12, 12, 8, 8, 8, 12],
    sections: [
      { questionType: '5', count: 2, attempt: 1, title: 'Answer The Following' },
      { questionType: '4', count: 3, attempt: 2, title: 'Answer The Following' },
      { questionType: '3b', count: 4, attempt: 3, title: 'Answer The Following' },
      { questionType: '3a', count: 2, attempt: 1, title: 'Activity' },
      { questionType: '2b', count: 5, attempt: 3, title: 'Answer The Following' },
      { questionType: '2a', count: 3, attempt: 2, title: 'Activity' },
      { questionType: '1b', count: 4, attempt: 3, title: 'Objective Questions' },
      { questionType: '1a', count: 4, attempt: 2, title: 'Multiple Choice Questions' },
    ],
  },
}

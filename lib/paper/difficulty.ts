import type { Difficulty } from './types'

export const DIFFICULTY_PROFILES: Record<
  Difficulty,
  Record<Difficulty, number>
> = {
  easy: { easy: 0.8, medium: 0.2, hard: 0 },
  medium: { easy: 0.2, medium: 0.6, hard: 0.2 },
  hard: { easy: 0.15, medium: 0.3, hard: 0.55 },
}

const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard']

export function allocateDifficultyCounts(
  total: number,
  selectedDifficulty: Difficulty,
) {
  const profile = DIFFICULTY_PROFILES[selectedDifficulty]
  const allocations = difficultyOrder.map((difficulty) => {
    const exact = total * profile[difficulty]

    return {
      difficulty,
      count: Math.floor(exact),
      remainder: exact - Math.floor(exact),
    }
  })

  let unallocated = total - allocations.reduce(
    (sum, allocation) => sum + allocation.count,
    0,
  )

  for (const allocation of [...allocations].sort(
    (left, right) => right.remainder - left.remainder,
  )) {
    if (unallocated === 0) {
      break
    }

    allocation.count += 1
    unallocated -= 1
  }

  return Object.fromEntries(
    allocations.map(({ difficulty, count }) => [difficulty, count]),
  ) as Record<Difficulty, number>
}

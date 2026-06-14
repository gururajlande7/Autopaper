import { describe, expect, it } from 'vitest'
import { allocateDifficultyCounts } from '../lib/paper/difficulty'

describe('allocateDifficultyCounts', () => {
  it('keeps an easy paper mostly easy with a few medium questions', () => {
    expect(allocateDifficultyCounts(10, 'easy')).toEqual({
      easy: 8,
      medium: 2,
      hard: 0,
    })
  })

  it('makes medium papers mostly medium with easy and hard support', () => {
    expect(allocateDifficultyCounts(10, 'medium')).toEqual({
      easy: 2,
      medium: 6,
      hard: 2,
    })
  })

  it('makes hard papers mostly hard while retaining all levels', () => {
    expect(allocateDifficultyCounts(20, 'hard')).toEqual({
      easy: 3,
      medium: 6,
      hard: 11,
    })
  })
})

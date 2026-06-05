import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filterWord: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0 }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('voting increases the number of votes', async () => {
    const anecdote = { id: 1, content: 'Test', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.update.mockResolvedValue({ ...anecdote, votes: 1 })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
  })
})

describe('the hook useAnecdotes, which brings the list of anecdotes from the store for any component', () => {
  const anecdotes = [
    { id: 1, content: 'eka', votes: 50 },
    { id: 2, content: 'toka', votes: 1 },
    { id: 3, content: 'kolmas', votes: 100 }
  ]

  it('brings the anecdotes in the order of the number of votes', async () => {
    const unsortedAnecdotes = anecdotes
    anecdoteService.getAll.mockResolvedValue(unsortedAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())
    
    await act(async () => {
      await result.current.initialize()
    })

    const { result: sortedAnecdotes } = renderHook(() => useAnecdotes())

    expect(sortedAnecdotes.current[0].votes).toBe(100)
    expect(sortedAnecdotes.current[1].votes).toBe(50)
    expect(sortedAnecdotes.current[2].votes).toBe(1)
  })

  it('brings the anecdotes filtered', async () => {
    useAnecdoteStore.setState({ anecdotes: anecdotes })
    const { result: unfilteredAnecdotes } = renderHook(() => useAnecdotes())
    expect(unfilteredAnecdotes.current).toHaveLength(3)

    useAnecdoteStore.setState({ anecdotes: anecdotes, filterWord: 'eka' })
    const { result: filteredAnecdotes } = renderHook(() => useAnecdotes())
    expect(filteredAnecdotes.current).toHaveLength(1)

    useAnecdoteStore.setState({ anecdotes: anecdotes, filterWord: 'ka' })
    const { result: filteredAnecdotes2 } = renderHook(() => useAnecdotes())
    expect(filteredAnecdotes2.current).toHaveLength(2)
  })
})
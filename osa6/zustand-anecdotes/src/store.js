import { create } from 'zustand'
import anecdoteService from './services/anecdotes'
/*
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdoteText => ({
  content: anecdoteText,
  id: getId(),
  votes: 0
})
*/
const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filterWord: '',
  actions: {
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(
        id, { ...anecdote, votes: anecdote.votes + 1 }
      )
      set(
        state => ({
          anecdotes: state.anecdotes.map(a =>
            a.id === id ? updated : a
          ).toSorted((a, b) => b.votes - a.votes)
        }))
    },
    deleteAnecdote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      if (anecdote.votes != 0) {
        return
      } else {
        await anecdoteService.remove(id)
        set(
          state => ({
            anecdotes: state.anecdotes.filter(a => a.id !== id)
          }))
      }
    },
    setFilter: value => set(() => ({ filterWord: value })),
    initialize: async () => {
      const unsortedAnecdotes = await anecdoteService.getAll()
      const anecdotes = unsortedAnecdotes.toSorted((a, b) => b.votes - a.votes)
      set(() => ({ anecdotes }))
    }
  },
}))

const useNotificationStore = create((set) => ({
  notification: '',
  actions: {
    setNotification: message => set(() => ({ notification: message }))
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filterWord = useAnecdoteStore((state) => state.filterWord)
  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filterWord.toLowerCase())
  )
  return filteredAnecdotes
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export const useNotifications = () => useNotificationStore()
export const useNotificationActions = () => useNotificationStore((state) => state.actions)


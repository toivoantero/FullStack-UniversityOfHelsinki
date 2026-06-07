import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote, createAnecdote } from '../requests'
import AnecdoteContext from "../NotificationContext"
import useNotify from './useNotify'

export const useAnecdotes = () => {
    const { setNotification } = useNotify()
    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: 1
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (anecdote) => {
            setNotification("You added an anecdote: '" + anecdote.content + "'")
            setTimeout(() => {
                setNotification(null)
            }, 5000)
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        },
        onError: (error) => {
            setNotification(error.message)
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        }
    })

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (anecdote) => {
            setNotification("You voted the anecdote: '" + anecdote.content + "'")
            setTimeout(() => {
                setNotification(null)
            }, 5000)
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        }
    })

    return {
        anecdotes: result.data,
        getIsPending: result.isPending,
        getIsError: result.isError,
        onCreate: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
        handleVote: (anecdote) => updateAnecdoteMutation.mutate({
            ...anecdote, votes: anecdote.votes + 1
        })
    }
}
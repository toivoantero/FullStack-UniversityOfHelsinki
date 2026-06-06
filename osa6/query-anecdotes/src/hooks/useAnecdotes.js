import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote, createAnecdote } from '../requests'

export const useAnecdotes = () => {
    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: 1
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        },
    })

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        }
    })

    return {
        anecdotes: result.data,
        isPending: result.isPending,
        isError: result.isError,
        onCreate: (content) => newAnecdoteMutation.mutate({ content, votes: 0 }),
        handleVote: (anecdote) => updateAnecdoteMutation.mutate({
            ...anecdote, votes: anecdote.votes + 1
        })
    }
}
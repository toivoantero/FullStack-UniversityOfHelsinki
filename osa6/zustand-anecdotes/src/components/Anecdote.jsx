import { useAnecdoteActions } from '../store'

const Anecdote = ({ anecdote }) => {
    const { vote } = useAnecdoteActions()

    return (
        <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
        </div>
    )
}

export default Anecdote
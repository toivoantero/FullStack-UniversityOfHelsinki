import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../store'

const Anecdote = ({ anecdote }) => {
    const { vote } = useAnecdoteActions()
    const { setNotification } = useNotificationActions()
    const { deleteAnecdote } = useAnecdoteActions()

    const handleVote = () => {
        vote(anecdote.id)
        setNotification("You voted '" + anecdote.content + "'")
        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }

    const handleDelete = () => {
        deleteAnecdote(anecdote.id)
        setNotification("You deleted '" + anecdote.content + "'")
        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }

    return (
        <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
                has {anecdote.votes}
                <button onClick={() => handleVote()}>vote</button>
                {anecdote.votes === 0 && <button onClick={() => handleDelete()}>delete</button>}
            </div>
        </div>
    )
}

export default Anecdote
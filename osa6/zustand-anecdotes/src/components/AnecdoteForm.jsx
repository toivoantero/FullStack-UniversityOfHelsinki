import { useAnecdoteActions } from '../store'
import Anecdote from './Anecdote'
import { useNotificationActions } from '../store'

const AnecdoteForm = () => {
    const { add } = useAnecdoteActions()
    const { setNotification } = useNotificationActions()

    const addAnecdote = async (e) => {
        e.preventDefault()
        const content = e.target.anecdote.value
        add(content)
        setNotification("You added an anecdote: '" + content + "'")
        setTimeout(() => {
            setNotification(null)
        }, 5000)
        e.target.reset()
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="anecdote" />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm
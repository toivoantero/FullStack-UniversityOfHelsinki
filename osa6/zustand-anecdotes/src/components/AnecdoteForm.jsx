import { useAnecdoteActions } from '../store'
import Anecdote from './Anecdote'

const AnecdoteForm = () => {
    const { add } = useAnecdoteActions()

    const addAnecdote = (e) => {
        e.preventDefault()
        const content = e.target.anecdote.value
        add(content)
        e.target.reset()
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="anecdote" />
                    <button type="submit">add</button>
                </div>
                <button>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm
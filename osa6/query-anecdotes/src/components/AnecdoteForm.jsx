import { useAnecdotes } from '../hooks/useAnecdotes'

const AnecdoteForm = () => {
  const { onCreate: addAnecdoteToServer } = useAnecdotes()

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    addAnecdoteToServer(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
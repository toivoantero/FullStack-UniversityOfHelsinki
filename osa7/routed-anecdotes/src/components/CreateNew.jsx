import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useAnecdotes } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()
  const { addAnecdote } = useAnecdotes()

  const handleSubmit = (e) => {
    e.preventDefault()
    const newContent = content.inputProps.value
    const newAuthor = author.inputProps.value
    const newInfo = info.inputProps.value
    addAnecdote({ content: newContent, author: newAuthor, info: newInfo, votes: 0 })
    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form id='createAnecdote' onSubmit={handleSubmit} onReset={handleReset}>
        <div>
          content
          <input name='content' {...content.inputProps} />
        </div>
        <div>
          author
          <input name='author' {...author.inputProps} />
        </div>
        <div>
          url for more info
          <input name='info' {...info.inputProps} />
        </div>
        <button>create</button>
        <input type='reset' value="reset" />
      </form>
    </div>
  )
}

export default CreateNew

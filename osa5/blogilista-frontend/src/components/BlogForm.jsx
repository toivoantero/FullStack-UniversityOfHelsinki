import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog, user }) => {
  const navigate = useNavigate()
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    navigate('/')
  }

  return (
    <div>
      {!user
        ? <div />
        :
        <div>
          <h2>create new</h2>
          <form onSubmit={addBlog}>
            <div>
              <label>title:
                <input
                  value={newTitle}
                  onChange={event => setNewTitle(event.target.value)}
                />
              </label>
              <br />
              <label>author:
                <input
                  value={newAuthor}
                  onChange={event => setNewAuthor(event.target.value)}
                />
              </label>
              <br />
              <label>url:
                <input
                  value={newUrl}
                  onChange={event => setNewUrl(event.target.value)}
                />
              </label>
            </div>
            <div>
              <button type="submit">create</button>
            </div>
          </form>
        </div>
      }
    </div>)
}

export default BlogForm
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

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
              <TextField
                label="title"
                value={newTitle}
                style={{ margin: 5 }}
                onChange={event => setNewTitle(event.target.value)}
              />
              <br />
              <TextField
                label="author"
                value={newAuthor}
                style={{ margin: 5 }}
                onChange={event => setNewAuthor(event.target.value)}
              />
              <br />
              <TextField
                label="url"
                value={newUrl}
                style={{ margin: 5 }}
                onChange={event => setNewUrl(event.target.value)}
              />
            </div>
            <div>
              <Button type="submit" variant="contained" style={{ margin: 10 }}>
                create
              </Button>
            </div>
          </form>
        </div>
      }
    </div>)
}

export default BlogForm
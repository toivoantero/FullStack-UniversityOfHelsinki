import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotificationMessage({
        content: `wrong username or password`,
        type: 'error'
      })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    window.location.reload();
  }

  const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage({
        content: `Added ${blogObject.title} by ${blogObject.author}`,
        type: 'success'
      })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000)
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    })
  }

  const handleInputChange = event => {
    if (event.target.name === "newTitle") {
      setNewTitle(event.target.value)
    } else if (event.target.name === "newAuthor") {
      setNewAuthor(event.target.value)
    } else if (event.target.name === "newUrl") {
      setNewUrl(event.target.value)
    } else if (event.target.name === "username") {
      setUsername(event.target.value)
    } else if (event.target.name === "password") {
      setPassword(event.target.value)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      {!user &&
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          handleInputChange={handleInputChange}
        />}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          {<BlogForm
            addBlog={addBlog}
            newTitle={newTitle}
            newAuthor={newAuthor}
            newUrl={newUrl}
            handleInputChange={handleInputChange}
          />}
          <br />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
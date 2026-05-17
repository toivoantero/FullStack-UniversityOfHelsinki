import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => a.likes - b.likes))
    )
  }, [refresh])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      setNotificationMessage({
        content: 'wrong username or password',
        type: 'error'
      })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    window.location.reload()
  }

  const addBlog = blogObject => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setRefresh(!refresh)
        setNotificationMessage({
          content: `Added ${blogObject.title} by ${blogObject.author}`,
          type: 'success'
        })
        setTimeout(() => {
          setNotificationMessage(null)
        }, 4000)
      })
  }

  const addLikes = blogObject => {
    blogService
      .update(blogObject.id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(b => b.id !== blogObject.id ? b : returnedBlog))
        setRefresh(!refresh)
      })
  }

  const deleteBlog = blogObject => {
    if (confirm('Remove blog ' + blogObject.title + ' by ' + blogObject.author + '?')) {
      blogService
        .remove(blogObject.id)
      window.location.reload()
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      {!user &&
        <LoginForm
          logUserIn={handleLogin}
        />}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel='create new blog'>
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
          <br />
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              updateBlog={addLikes}
              removeBlog={deleteBlog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App
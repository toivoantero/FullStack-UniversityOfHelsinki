import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
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
      setNotificationMessage({
        content: `${user.name} logged in`,
        type: 'success'
      })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4000)
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
    setUser(null)
    blogService.setToken(null)
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
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blogObject.id))
          setRefresh(!refresh)
        })
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/blogs">blogs</Link>
        <Link style={padding} to="/create">new blog</Link>
        {!user ? <Link style={padding} to="/login">login</Link> : <Link style={padding} to="/"><button onClick={handleLogout}>logout</button></Link>}
      </div>

      <Routes>
        <Route path="/blogs/:id" element={
          <Blog
            blogs={blogs}
            user={user}
            updateBlog={addLikes}
            removeBlog={deleteBlog}
          />
        } />
        <Route path="/blogs" element={
          <BlogList blogs={blogs} notificationMessage={notificationMessage} />
        } />
        <Route path="/" element={
          <BlogList blogs={blogs} notificationMessage={notificationMessage} />
        } />
        <Route path="/create" element={
          <BlogForm user={user} createBlog={addBlog} />
        } />
        <Route path="/login" element={
          <LoginForm logUserIn={handleLogin} notificationMessage={notificationMessage} />
        } />
      </Routes>
    </Router>
  )
}

export default App
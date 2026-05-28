import { Link } from 'react-router-dom'
import Blog from './Blog'
import Notification from './Notification'
import LoginForm from './LoginForm'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const BlogList = ({ blogs, notificationMessage }) => {
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      <div>
        <ul>
          {blogs.map(blog => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogList
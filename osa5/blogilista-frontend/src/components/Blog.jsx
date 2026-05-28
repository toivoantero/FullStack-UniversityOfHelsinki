import { useParams, useNavigate } from 'react-router-dom'

const Blog = ({ blogs, user, updateBlog, removeBlog }) => {
  const navigate = useNavigate()
  const id = useParams().id
  const blog = blogs.find(n => n.id === id)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLikes = event => {
    event.preventDefault()
    updateBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    })
  }

  const deleteBlog = event => {
    event.preventDefault()
    removeBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author
    })
    navigate('/')
  }

  return (
    <div data-testid="blog-element" style={blogStyle}>
      <div>
        <h3>{blog.author}: {blog.title}</h3>
      </div>
      <div data-testid="hideShowInfo">
        {blog.url}<br />
        <span>likes {blog.likes}</span>
        {user && (
          <button data-testid="like-button" onClick={addLikes}>like</button>
        )}
        <br />
        Added by {blog.user?.name}<br />
        {(user && user?.username === blog.user?.username) && (
          <button onClick={deleteBlog}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
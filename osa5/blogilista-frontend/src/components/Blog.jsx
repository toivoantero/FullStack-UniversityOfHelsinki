import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
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
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={() => setVisible(true)}>view</button>
        <button style={showWhenVisible} onClick={() => setVisible(false)}>hide</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url}<br />
        likes {blog.likes}<button onClick={addLikes}>like</button><br />
        {blog.user?.name}<br />
        {user?.username === blog.user?.username && (
          <button onClick={deleteBlog}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
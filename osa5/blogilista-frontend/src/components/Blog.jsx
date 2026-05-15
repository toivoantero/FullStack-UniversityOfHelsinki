import { useState } from 'react'

const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={() => setVisible(true)}>view</button>
        <button style={showWhenVisible} onClick={() => setVisible(false)}>hide</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url}<br />
        likes {blog.likes}<button>likes</button><br />
        {blog.user?.name}
      </div>
    </div>
  )
}

export default Blog
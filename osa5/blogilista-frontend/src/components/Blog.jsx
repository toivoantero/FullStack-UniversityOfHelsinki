import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, Card, CardContent, CardActions, Typography } from '@mui/material'

const Blog = ({ blogs, user, updateBlog, removeBlog }) => {
  const navigate = useNavigate()
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

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
    <Card variant="outlined">
      <CardContent>
        <div>
          <h2>{blog.title}</h2>
          <h3>by {blog.author}</h3>
        </div>
        <div>
          {blog.url}<br />
          Added by {blog.user?.name}
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Typography>{blog.likes} likes</Typography>
            <CardActions>
              {user && (
                <Button variant='outlined' color='success' size='large' onClick={addLikes}>like</Button>
              )}
              <br />
              {(user && user?.username === blog.user?.username) && (
                <Button variant='outlined' color='error' size='large' onClick={deleteBlog}>remove</Button>
              )}
            </CardActions>
          </Box>
        </div>
      </CardContent>
    </Card>
  )
}

export default Blog
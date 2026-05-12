const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'BlogiOtsikko',
    author: 'Pekka',
    url: 'www.ok.fi',
    likes: 3
  },
  {
    title: 'HyväArtikkeli',
    author: 'Ritva',
    url: 'www.ok.fi',
    likes: 7
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}
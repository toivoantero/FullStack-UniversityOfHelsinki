const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "BlogiOtsikko",
    author: "Pekka",
    url: "www.ok.fi",
    likes: 3
  },
  {
    title: "HyväArtikkeli",
    author: "Ritva",
    url: "www.ok.fi",
    likes: 7
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}
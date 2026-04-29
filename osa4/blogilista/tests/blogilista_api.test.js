const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('all blogs have a field named "id"', async () => {
  const response = await api.get('/api/blogs')
  const ids = response.body.every(blog => Object.hasOwn(blog, "id"))
  assert(ids)
})

describe('when a blog is added', () => {
  test('the add of a blog is succesful', async () => {
    const newBlog = {
      title: "ParasBlogi",
      author: "Jaska",
      url: "www.ok.fi",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('ParasBlogi'))
  })
  test('and the field "likes" has no value, a zero will be assigned', async () => {
    const newBlog = {
      title: "ParasBlogi",
      author: "Jaska",
      url: "www.ok.fi",
      likes: null
    }

    await api
      .post('/api/blogs')
      .send(newBlog)

    const response = await api.get('/api/blogs')
    const lastBlogLikes = response.body[response.body.length - 1].likes
    assert.strictEqual(response.body[response.body.length - 1].likes, 0)
  })

  test.only('and title and url are missing, then status 400', async () => {
    const newBlog = {
      title: null,
      author: "Jaska",
      url: null,
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
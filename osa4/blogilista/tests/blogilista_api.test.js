const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('all blogs have a field named "id"', async () => {
  const response = await api.get('/api/blogs')
  const ids = response.body.every(blog => Object.hasOwn(blog, "id"))
  assert(ids)
})

describe('when a blog is added', () => {
  test('the add is succesful', async () => {
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

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
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

  test('and title and url are missing, then status 400', async () => {
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

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(b => b.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('a specific blog can be viewed', async () => {
  const updatedBlog = {
    title: "ParasBlogi",
    author: "Jaska",
    url: "www.ok.fi",
    likes: 2
  }
  const blogsAtStart = await helper.blogsInDb()
  const blogToPut = blogsAtStart[0]

  const resultBlog = await api
    .put(`/api/blogs/${blogToPut.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body.likes, updatedBlog.likes)

})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'initial', passwordHash })

    await user.save()
  })

  test.only('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'abc',
      name: 'Markus Liimatainen',
      password: '123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test.only('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'initial',
      name: 'Käyttäväinen',
      password: '123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test.only('creation fails with proper statuscode and message if username length is less than 3 signs', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Käyttäväinen',
      password: '123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('is shorter than the minimum allowed length'))
  })

  test.only('creation fails with proper statuscode and message if password length is less than 3 signs', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'abc',
      name: 'Käyttäväinen',
      password: '12',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid password'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
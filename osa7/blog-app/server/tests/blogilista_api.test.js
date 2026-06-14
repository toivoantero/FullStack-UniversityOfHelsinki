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
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('daapa', 10)
  const user = new User({
    name: 'Käyttäväinen',
    username: 'diipa',
    passwordHash
  })
  await user.save()
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('all blogs have a field named "id"', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.every(blog => Object.hasOwn(blog, 'id'))
    assert(ids)
  })

  test('a specific blog can be viewed', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'diipa', password: 'daapa' })
      .expect(200)
    const token = loginResponse.body.token

    const updatedBlog = {
      title: 'ParasBlogi',
      author: 'Jaska',
      url: 'www.ok.fi',
      likes: 2
    }
    const blogsAtStart = await helper.blogsInDb()
    const blogToPut = blogsAtStart[0]

    const resultBlog = await api
      .put(`/api/blogs/${blogToPut.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body.likes, updatedBlog.likes)
  })

  test('a blog can be deleted', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'diipa', password: 'daapa' })
      .expect(200)
    const token = loginResponse.body.token

    const newBlog = {
      title: 'ParasBlogi',
      author: 'Jaska',
      url: 'www.ok.fi',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[[blogsAtStart.length - 1]]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  describe('when there is an attempt to add a blog', async () => {
    let token
    beforeEach(async () => {
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'diipa', password: 'daapa' })
        .expect(200)

      token = loginResponse.body.token
    })
    test('the add is succesful', async () => {
      const newBlog = {
        title: 'ParasBlogi',
        author: 'Jaska',
        url: 'www.ok.fi',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
        title: 'ParasBlogi',
        author: 'Jaska',
        url: 'www.ok.fi',
        likes: null
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)

      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body[response.body.length - 1].likes, 0)
    })

    test('and title and url are missing, then the blog is not added and a proper status code is given', async () => {
      const newBlog = {
        title: null,
        author: 'Jaska',
        url: null,
        likes: 3
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })
    test('and token is missing from the user, then the blog is not added and a proper status code is given', async () => {
      const newBlog = {
        title: null,
        author: 'Jaska',
        url: null,
        likes: 3
      }

      await api
        .post('/api/blogs')
        .set('Authorization', null)
        .send(newBlog)
        .expect(401)
    })
  })

  describe('when there is initially one user at db', () => {
    test('creation of a new user succeeds with a fresh username', async () => {
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

    test('creation of a new user fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'diipa',
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

    test('creation of a new user fails with proper statuscode and message if username length is less than 3 signs', async () => {
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

    test('creation of a new user fails with proper statuscode and message if password length is less than 3 signs', async () => {
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
})
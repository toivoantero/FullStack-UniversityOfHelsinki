const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByText('login').click()
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByText('login').click()
      await expect(page.getByText('Log in to application')).toBeVisible()
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByText('login').click()
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByText('login').click()
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright')
      await expect(page.getByText(/^a blog created by playwright/i)).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright')
      await page.getByText(/^a blog created by playwright/i).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText(/1 likes/)).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      page.on('dialog', async dialog => {
        await dialog.accept();
      });

      await createBlog(page, 'a blog created by playwright')
      await page.getByText(/^a blog created by playwright/i).click()
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText(/^a blog created by playwright/i)).not.toBeVisible()
    })

    test('the user who did not add the blog can not see the delete button for the blog', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'Toinen Käyttäjä',
          username: 'toinen',
          password: 'salasana'
        }
      })

      await createBlog(page, 'a blog created by Matti')

      await page.getByText('logout').click()
      await page.getByText('login').click()
      await loginWith(page, 'toinen', 'salasana')
      await page.getByText(/^a blog created by Matti/i).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'blogi A')
        await createBlog(page, 'blogi B')
      })

      test('the blogs are in order', async ({ page }) => {
        const blogiA = page.getByText(/^blogi A/i).locator('..')
        const blogiB = page.getByText(/^blogi B/i).locator('..')
        const ylinBlogi = page.getByText(/^view/i).locator('..').first()

        // tarkistetaan että blogi A on ylinnä
        await expect(ylinBlogi).toContainText('blogi A')
        console.log('YLIN: ', await ylinBlogi.textContent())

        // lisätään 1 like blogiin B
        await blogiB.getByText('view').click()
        await blogiB.getByText('like', { exact: true }).click()

        // tarkistetaan että like on lisätty
        await expect(blogiB.getByText('likes')).toHaveText('1 likes')

        // tarkistetaan että blogi B on ylinnä
        await expect(ylinBlogi).toContainText('blogi B')
        await expect(ylinBlogi.getByText(/^blogi B/i)).toBeVisible()
        await expect(ylinBlogi.getByText(/^blogi A/i)).not.toBeVisible()
        console.log('YLIN: ', await ylinBlogi.textContent())

        // lisätään 2 likeä blogiin A
        await blogiA.getByText('view').click()
        await blogiA.getByText('like', { exact: true }).click()
        await expect(blogiA.getByText('likes')).toHaveText('1 likes')
        await blogiA.getByText('like', { exact: true }).click()

        // tarkistetaan että liket on lisätty
        await expect(blogiA.getByText('likes')).toHaveText('2 likes')

        // tarkistetaan että blogi A on ylinnä
        await expect(ylinBlogi).toContainText('blogi A')
        await expect(ylinBlogi.getByText(/^blogi A/i)).toBeVisible()
        await expect(ylinBlogi.getByText(/^blogi B/i)).not.toBeVisible()
        console.log('YLIN: ', await ylinBlogi.textContent())
      })
    })
  })
})
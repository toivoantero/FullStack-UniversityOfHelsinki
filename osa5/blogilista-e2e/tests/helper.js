const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByRole('textbox', { name: 'title' }).fill(title)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByRole('button', { name: 'cancel' }).click()
    await page.getByText(title).last().waitFor()
}

export { loginWith, createBlog }
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { MemoryRouter } from 'react-router-dom'

test('<BlogForm /> calls the callback function with the correct data when the blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()
  const viewer = {}

  render(
    <MemoryRouter>
      <BlogForm createBlog={createBlog} user={viewer} />
    </MemoryRouter>
  )

  const input = screen.getByRole('textbox', { name: /title/ })
  const sendButton = screen.getByText('create')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
})
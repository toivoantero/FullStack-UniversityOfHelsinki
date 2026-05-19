import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'paras blogi'
  }

  render(<Blog blog={blog} />)

  const title = screen.getByText('paras blogi')
  expect(title).toBeDefined()
})

test('renders url, likes and the user after the button is pressed', async () => {
  const blog = {
    title: 'paras blogi',
    likes: 3,
    url: 'www.abc.def',
    user: {
      username: 'diipa',
      name: 'Login testaaja',
      id: '69fcddfbdc67c6e885604dee'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByTestId('hideShowInfo')
  expect(element).not.toBeVisible()

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  expect(element).toBeVisible()
})

test('clicking the like-button twice calls event handler twice', async () => {
  const blog = {}
  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
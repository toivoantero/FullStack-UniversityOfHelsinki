import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
  const blogs = [
    { title: 'paras blogi' }
  ]

  render(
    <MemoryRouter>
      <Blog blogs={blogs} />
    </MemoryRouter>
  )

  const title = screen.getByText(/paras blogi/)
  expect(title).toBeDefined()
})

describe('the user who is not logged in', () => {
  test('will see the blog info but not the like- and remove-buttons', async () => {
    const blogs = [{
      title: 'paras blogi',
      likes: 3
    }]

    render(
      <MemoryRouter>
        <Blog blogs={blogs} />
      </MemoryRouter>
    )

    const title = screen.getByText(/paras blogi/)
    expect(title).toBeVisible()
    const likes = screen.getByText(/likes/)
    expect(likes).toBeVisible()
    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
    const likeButton = screen.queryByText('like')
    expect(likeButton).toBeNull()
  })
})

describe('the logged in user', () => {
  test('who did not add the blog will see the like-button but not the remove-button', async () => {
    const blogs = [{
      title: 'paras blogi',
      likes: 3,
      user: {
        username: 'mliimatainen',
        name: 'Markus',
        id: '72fcddfbdc67c6e885605dbb'
      }
    }]

    const user = {
      username: 'diipa',
      name: 'Käyttäväinen',
      id: '69fcddfbdc67c6e885604dee'
    }

    render(
      <MemoryRouter>
        <Blog blogs={blogs} user={user} />
      </MemoryRouter>
    )

    const likeButton = screen.getByText('like')
    expect(likeButton).toBeVisible()
    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
  })

  test('who did also add the blog will see the remove-button', async () => {
    const blogs = [{
      title: 'paras blogi',
      likes: 3,
      user: {
        username: 'diipa',
        name: 'Käyttäväinen',
        id: '69fcddfbdc67c6e885604dee'
      }
    }]

    const user = {
      username: 'diipa',
      name: 'Käyttäväinen',
      id: '69fcddfbdc67c6e885604dee'
    }

    render(
      <MemoryRouter>
        <Blog blogs={blogs} user={user} />
      </MemoryRouter>
    )

    const likeButton = screen.getByText('like')
    expect(likeButton).toBeVisible()
    const removeButton = screen.getByText('remove')
    expect(removeButton).toBeVisible()
  })
})

test('clicking the like-button twice calls event handler twice', async () => {
  const blogs = [{}]
  const adder = {}
  const mockHandler = vi.fn()

  render(
    <MemoryRouter>
      <Blog blogs={blogs} user={adder} updateBlog={mockHandler} />
    </MemoryRouter>
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
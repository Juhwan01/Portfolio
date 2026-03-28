import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import BlogAdmin from '../BlogAdmin'

vi.mock('@components/admin/MarkdownEditor', () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea data-testid="mock-md-editor" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('BlogAdmin', () => {
  it('shows "Blog Posts" heading after load', async () => {
    render(<BlogAdmin />)
    await waitFor(() => {
      expect(screen.getByText('Blog Posts')).toBeInTheDocument()
    })
  })

  it('shows "New Post" button', async () => {
    render(<BlogAdmin />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'New Post' })).toBeInTheDocument()
    })
  })

  it('renders post titles in table', async () => {
    render(<BlogAdmin />)
    await waitFor(() => {
      expect(screen.getByText('Understanding Transformers')).toBeInTheDocument()
      expect(screen.getByText('React Performance Tips')).toBeInTheDocument()
    })
  })

  it('clicking "New Post" shows "New Post" form heading', async () => {
    const user = userEvent.setup()
    render(<BlogAdmin />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'New Post' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'New Post' }))

    expect(screen.getByRole('heading', { name: 'New Post' })).toBeInTheDocument()
  })

  it('clicking "Cancel" in form returns to list', async () => {
    const user = userEvent.setup()
    render(<BlogAdmin />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'New Post' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'New Post' }))
    expect(screen.getByRole('heading', { name: 'New Post' })).toBeInTheDocument()

    // There are two Cancel buttons in the form view (header and footer). Click the first one.
    const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' })
    await user.click(cancelButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Blog Posts')).toBeInTheDocument()
    })
  })

  it('clicking "Edit" on a post shows "Edit Post" form heading', async () => {
    const user = userEvent.setup()
    render(<BlogAdmin />)

    await waitFor(() => {
      expect(screen.getByText('Understanding Transformers')).toBeInTheDocument()
    })

    const editButtons = screen.getAllByText('Edit')
    await user.click(editButtons[0])

    expect(screen.getByRole('heading', { name: 'Edit Post' })).toBeInTheDocument()
  })

  it('Delete button exists for each post', async () => {
    render(<BlogAdmin />)

    await waitFor(() => {
      expect(screen.getByText('Understanding Transformers')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons.length).toBe(2)
  })
})

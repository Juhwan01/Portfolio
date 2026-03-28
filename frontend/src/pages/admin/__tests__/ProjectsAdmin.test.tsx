import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import ProjectsAdmin from '../ProjectsAdmin'

vi.mock('@components/admin/ProjectForm', () => ({
  default: ({ onCancel }: { onCancel: () => void }) => (
    <div data-testid="mock-project-form">
      <button onClick={onCancel}>MockCancel</button>
    </div>
  ),
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ProjectsAdmin', () => {
  it('shows "Projects" heading after load', async () => {
    render(<ProjectsAdmin />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    })
  })

  it('shows "+ Add Project" button', async () => {
    render(<ProjectsAdmin />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '+ Add Project' })).toBeInTheDocument()
    })
  })

  it('renders project titles in table', async () => {
    render(<ProjectsAdmin />)
    await waitFor(() => {
      expect(screen.getByText('AI ChatBot')).toBeInTheDocument()
      expect(screen.getByText('Portfolio Website')).toBeInTheDocument()
    })
  })

  it('shows project categories and status badges', async () => {
    render(<ProjectsAdmin />)
    await waitFor(() => {
      expect(screen.getByText('AI')).toBeInTheDocument()
      expect(screen.getByText('Web')).toBeInTheDocument()
    })

    // Status badges
    expect(screen.getByText('완료')).toBeInTheDocument()
    expect(screen.getByText('진행중')).toBeInTheDocument()
  })

  it('clicking "+ Add Project" shows form modal with "New Project" heading', async () => {
    const user = userEvent.setup()
    render(<ProjectsAdmin />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '+ Add Project' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '+ Add Project' }))

    expect(screen.getByText('New Project')).toBeInTheDocument()
    expect(screen.getByTestId('mock-project-form')).toBeInTheDocument()
  })

  it('clicking close button on modal closes it', async () => {
    const user = userEvent.setup()
    render(<ProjectsAdmin />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '+ Add Project' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '+ Add Project' }))
    expect(screen.getByText('New Project')).toBeInTheDocument()

    // The close button has text content of a unicode character
    const closeButton = screen.getByText('✕')
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('New Project')).not.toBeInTheDocument()
    })
  })

  it('Delete button shows confirmation modal', async () => {
    const user = userEvent.setup()
    render(<ProjectsAdmin />)

    await waitFor(() => {
      expect(screen.getByText('AI ChatBot')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    expect(screen.getByText('Delete Project?')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete this project/)).toBeInTheDocument()
  })

  it('clicking "Cancel" in delete modal closes it', async () => {
    const user = userEvent.setup()
    render(<ProjectsAdmin />)

    await waitFor(() => {
      expect(screen.getByText('AI ChatBot')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    expect(screen.getByText('Delete Project?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(screen.queryByText('Delete Project?')).not.toBeInTheDocument()
    })
  })
})

import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import SkillsAdmin from '../SkillsAdmin'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('SkillsAdmin', () => {
  it('shows "Skills" heading after load', async () => {
    render(<SkillsAdmin />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument()
    })
  })

  it('shows "+ Add Skill" button', async () => {
    render(<SkillsAdmin />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '+ Add Skill' })).toBeInTheDocument()
    })
  })

  it('renders skill names', async () => {
    render(<SkillsAdmin />)
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Python')).toBeInTheDocument()
      expect(screen.getByText('FastAPI')).toBeInTheDocument()
      expect(screen.getByText('TensorFlow')).toBeInTheDocument()
    })
  })

  it('groups skills by category', async () => {
    render(<SkillsAdmin />)
    await waitFor(() => {
      expect(screen.getByText('Frontend')).toBeInTheDocument()
      expect(screen.getByText('Backend')).toBeInTheDocument()
      expect(screen.getByText('AI')).toBeInTheDocument()
    })
  })

  it('clicking "+ Add Skill" shows "New Skill" form modal', async () => {
    const user = userEvent.setup()
    render(<SkillsAdmin />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '+ Add Skill' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '+ Add Skill' }))

    expect(screen.getByText('New Skill')).toBeInTheDocument()
  })

  it('form has required fields (Skill Name, Category, Icon, Order)', async () => {
    const user = userEvent.setup()
    render(<SkillsAdmin />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '+ Add Skill' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '+ Add Skill' }))

    expect(screen.getByText(/Skill Name/)).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText(/Icon/)).toBeInTheDocument()
    expect(screen.getByText(/Order/)).toBeInTheDocument()
  })

  it('Cancel in form modal closes it', async () => {
    const user = userEvent.setup()
    render(<SkillsAdmin />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '+ Add Skill' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '+ Add Skill' }))
    expect(screen.getByText('New Skill')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(screen.queryByText('New Skill')).not.toBeInTheDocument()
    })
  })
})

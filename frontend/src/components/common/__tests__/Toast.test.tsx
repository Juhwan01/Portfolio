import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@/test/test-utils'
import ToastContainer, { toast } from '../Toast'

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing initially', () => {
    const { container } = render(<ToastContainer />)
    expect(container.innerHTML).toBe('')
  })

  it('shows message after calling toast', () => {
    render(<ToastContainer />)
    act(() => {
      toast('Hello world', 'success')
    })
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('shows check_circle icon for success type', () => {
    render(<ToastContainer />)
    act(() => {
      toast('Success message', 'success')
    })
    expect(screen.getByText('check_circle')).toBeInTheDocument()
  })

  it('shows error icon for error type', () => {
    render(<ToastContainer />)
    act(() => {
      toast('Error message', 'error')
    })
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  it('shows info icon for info type', () => {
    render(<ToastContainer />)
    act(() => {
      toast('Info message', 'info')
    })
    expect(screen.getByText('info')).toBeInTheDocument()
  })

  it('toast disappears after 4 seconds', () => {
    render(<ToastContainer />)
    act(() => {
      toast('Temporary', 'success')
    })
    expect(screen.getByText('Temporary')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.queryByText('Temporary')).not.toBeInTheDocument()
  })
})

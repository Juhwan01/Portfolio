import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { server } from '@/test/mocks/server'
import ImageUpload from '../ImageUpload'

vi.mock('@services/api', async () => {
  const actual = await vi.importActual('@services/api')
  return {
    ...actual,
    uploadImage: vi.fn(),
  }
})

import { uploadImage } from '@services/api'
const mockUploadImage = vi.mocked(uploadImage)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
})
afterAll(() => server.close())

describe('ImageUpload', () => {
  it('shows "Drag and drop an image here" when no value', () => {
    render(<ImageUpload onChange={() => {}} />)
    expect(screen.getByText('Drag and drop an image here')).toBeInTheDocument()
  })

  it('shows preview image when value provided', () => {
    render(<ImageUpload value="https://example.com/img.png" onChange={() => {}} />)
    const img = screen.getByAltText('Preview')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/img.png')
  })

  it('shows URL input when value provided', () => {
    render(<ImageUpload value="https://example.com/img.png" onChange={() => {}} />)
    const input = screen.getByDisplayValue('https://example.com/img.png')
    expect(input).toBeInTheDocument()
  })

  it('does not show URL input when no value', () => {
    const { container } = render(<ImageUpload onChange={() => {}} />)
    const textInput = container.querySelector('input[type="text"]')
    expect(textInput).toBeNull()
  })

  it('typing in URL input calls onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ImageUpload value="https://example.com/img.png" onChange={onChange} />)

    const input = screen.getByDisplayValue('https://example.com/img.png')
    await user.clear(input)
    await user.type(input, 'https://new-url.com/img.png')

    expect(onChange).toHaveBeenCalled()
  })

  it('uploads file and calls onChange with URL on valid image', async () => {
    const onChange = vi.fn()

    mockUploadImage.mockResolvedValue({
      url: 'https://example.com/uploaded.png',
      filename: 'uploaded.png',
    })

    const { container } = render(<ImageUpload onChange={onChange} />)

    const file = new File(['dummy'], 'photo.png', { type: 'image/png' })
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    // Use fireEvent for hidden inputs (userEvent.upload doesn't work with display:none)
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockUploadImage).toHaveBeenCalledWith(file)
      expect(onChange).toHaveBeenCalledWith('https://example.com/uploaded.png')
    })
  })

  it('shows error when non-image file selected', async () => {
    const onChange = vi.fn()
    const { container } = render(<ImageUpload onChange={onChange} />)

    const file = new File(['dummy'], 'doc.pdf', { type: 'application/pdf' })
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Please select an image file')).toBeInTheDocument()
    })
    expect(onChange).not.toHaveBeenCalled()
  })
})

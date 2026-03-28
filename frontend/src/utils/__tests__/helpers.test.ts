import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatDate, calculateReadTime, truncateText, getS3ImageUrl, debounce } from '../helpers'

describe('formatDate', () => {
  it('formats a valid ISO date string to Korean format', () => {
    const result = formatDate('2024-01-01')
    expect(result).toContain('2024')
    expect(result).toContain('1')
  })

  it('formats a full ISO datetime string', () => {
    const result = formatDate('2024-12-25T10:00:00Z')
    expect(result).toContain('2024')
    expect(result).toContain('12')
    expect(result).toContain('25')
  })

  it('formats a different date correctly', () => {
    const result = formatDate('2023-07-15')
    expect(result).toContain('2023')
    expect(result).toContain('7')
    expect(result).toContain('15')
  })
})

describe('calculateReadTime', () => {
  it('returns 1 for empty string', () => {
    const result = calculateReadTime('')
    expect(result).toBe(1)
  })

  it('returns 1 for short text under 200 words', () => {
    const shortText = 'Hello world this is a short text'
    const result = calculateReadTime(shortText)
    expect(result).toBe(1)
  })

  it('calculates correctly for text with exactly 200 words', () => {
    const words = Array(200).fill('word').join(' ')
    const result = calculateReadTime(words)
    expect(result).toBe(1)
  })

  it('calculates correctly for text with 201 words', () => {
    const words = Array(201).fill('word').join(' ')
    const result = calculateReadTime(words)
    expect(result).toBe(2)
  })

  it('calculates correctly for long text', () => {
    const words = Array(1000).fill('word').join(' ')
    const result = calculateReadTime(words)
    expect(result).toBe(5)
  })
})

describe('truncateText', () => {
  it('returns original text when length is within limit', () => {
    const result = truncateText('Hello', 10)
    expect(result).toBe('Hello')
  })

  it('returns original text when length equals limit', () => {
    const result = truncateText('Hello', 5)
    expect(result).toBe('Hello')
  })

  it('truncates and adds ellipsis when text exceeds limit', () => {
    const result = truncateText('Hello World', 5)
    expect(result).toBe('Hello...')
  })

  it('truncates to maxLength characters before ellipsis', () => {
    const result = truncateText('abcdefghij', 3)
    expect(result).toBe('abc...')
  })
})

describe('getS3ImageUrl', () => {
  it('returns a URL combining the S3 bucket URL and the key', () => {
    const result = getS3ImageUrl('images/photo.png')
    expect(result).toBe('https://test-bucket.s3.amazonaws.com/images/photo.png')
  })

  it('handles keys without path prefix', () => {
    const result = getS3ImageUrl('photo.png')
    expect(result).toBe('https://test-bucket.s3.amazonaws.com/photo.png')
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays function execution by the specified wait time', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('only executes the last call when called multiple times rapidly', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    debounced()

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('passes arguments to the debounced function', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 200)

    debounced('arg1', 'arg2')
    vi.advanceTimersByTime(200)

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('passes only the last arguments when called multiple times', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 200)

    debounced('first')
    debounced('second')
    debounced('third')

    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('third')
  })
})

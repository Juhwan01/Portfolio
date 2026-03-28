import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrollAnimation, useScrollProgress } from '../useScrollAnimation'

describe('useScrollAnimation', () => {
  it('returns false initially', () => {
    const { result } = renderHook(() => useScrollAnimation())
    expect(result.current).toBe(false)
  })

  it('accepts a custom threshold parameter', () => {
    const { result } = renderHook(() => useScrollAnimation(0.5))
    expect(result.current).toBe(false)
  })
})

describe('useScrollProgress', () => {
  beforeEach(() => {
    // Set up a scrollable document
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
      configurable: true,
    })
  })

  it('returns 0 initially', () => {
    const { result } = renderHook(() => useScrollProgress())
    expect(result.current).toBe(0)
  })

  it('updates scroll progress when scroll event fires', () => {
    const { result } = renderHook(() => useScrollProgress())

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 500,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    // scrollProgress = (500 / (2000 - 1000)) * 100 = 50
    expect(result.current).toBe(50)
  })

  it('returns 100 when scrolled to the bottom', () => {
    const { result } = renderHook(() => useScrollProgress())

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 1000,
        writable: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(100)
  })
})

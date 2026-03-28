import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../authStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset the store state between tests
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.logout()
    })
  })

  describe('initial state', () => {
    it('has null token', () => {
      const { result } = renderHook(() => useAuthStore())
      expect(result.current.token).toBeNull()
    })

    it('has isAuthenticated as false', () => {
      const { result } = renderHook(() => useAuthStore())
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('sets token and isAuthenticated to true', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.login('my-jwt-token')
      })

      expect(result.current.token).toBe('my-jwt-token')
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  describe('logout', () => {
    it('resets token to null and isAuthenticated to false', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.login('my-jwt-token')
      })
      expect(result.current.isAuthenticated).toBe(true)

      act(() => {
        result.current.logout()
      })

      expect(result.current.token).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('persistence', () => {
    it('persists state to localStorage under auth-storage key', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.login('persisted-token')
      })

      const stored = localStorage.getItem('auth-storage')
      expect(stored).not.toBeNull()

      const parsed = JSON.parse(stored!)
      expect(parsed.state.token).toBe('persisted-token')
      expect(parsed.state.isAuthenticated).toBe(true)
    })
  })
})

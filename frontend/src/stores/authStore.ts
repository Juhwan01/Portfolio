import { create } from 'zustand'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    token: null,
    isAuthenticated: false,
    login: (token: string) => {
      sessionStorage.setItem('auth-token', token)
      set({ token, isAuthenticated: true })
    },
    logout: () => {
      sessionStorage.removeItem('auth-token')
      set({ token: null, isAuthenticated: false })
    },
  })
)

// Restore token from sessionStorage on page reload (tab-scoped, not persistent across tabs)
const savedToken = sessionStorage.getItem('auth-token')
if (savedToken) {
  useAuthStore.getState().login(savedToken)
}

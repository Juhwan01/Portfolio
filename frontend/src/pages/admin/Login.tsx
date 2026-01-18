import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '@services/api'
import { useAuthStore } from '@stores/authStore'
import Button from '@components/common/Button'

const Login = () => {
  const navigate = useNavigate()
  const { login: setToken } = useAuthStore()
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = isRegister
        ? await register(formData)
        : await login(formData)

      setToken(response.accessToken)
      navigate('/admin')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-dark rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Admin <span className="gradient-text">Login</span>
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {isRegister ? 'Create admin account' : 'Sign in to manage your portfolio'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-400 hover:text-blue-300 transition text-sm"
            >
              {isRegister
                ? 'Already have an account? Sign in'
                : 'First time? Create admin account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

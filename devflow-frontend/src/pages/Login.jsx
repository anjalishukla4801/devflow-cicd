import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Dummy login for now — replace with API later
      if (form.email === 'admin@devflow.com' && form.password === 'admin123') {
        login({ name: 'Anjali', role: 'admin', email: form.email }, 'dummy-token-admin')
        navigate('/dashboard')
      } else if (form.email === 'dev@devflow.com' && form.password === 'dev123') {
        login({ name: 'Developer', role: 'developer', email: form.email }, 'dummy-token-dev')
        navigate('/dashboard')
      } else if (form.email === 'manager@devflow.com' && form.password === 'manager123') {
        login({ name: 'Manager', role: 'manager', email: form.email }, 'dummy-token-manager')
        navigate('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-white font-bold text-3xl">DevFlow</h1>
          <p className="text-gray-400 text-sm mt-1">DevOps Automation Platform</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <h2 className="text-white text-xl font-semibold mb-6">Sign in to your account</h2>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Test credentials hint */}
          <div className="mt-6 bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs font-medium mb-2">Test credentials:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>Admin: admin@devflow.com / admin123</p>
              <p>Dev: dev@devflow.com / dev123</p>
              <p>Manager: manager@devflow.com / manager123</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
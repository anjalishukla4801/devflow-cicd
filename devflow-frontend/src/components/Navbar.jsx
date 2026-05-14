import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLink = (path, label) => {
    const active = location.pathname === path
    return (
      <Link
        to={path}
        className={`text-sm px-3 py-1.5 rounded-lg transition ${
          active
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-sm">⚡</span>
          </div>
          <span className="text-white font-bold text-lg">DevFlow</span>
        </div>
        <div className="flex gap-1">
          {navLink('/dashboard', 'Dashboard')}
          {navLink('/pipelines', 'Pipelines')}
          {navLink('/issues', 'Issues')}
          {user?.role === 'admin' && navLink('/team', 'Team')}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          user?.role === 'admin' ? 'bg-purple-900/50 text-purple-400' :
          user?.role === 'manager' ? 'bg-blue-900/50 text-blue-400' :
          'bg-green-900/50 text-green-400'
        }`}>
          {user?.role}
        </span>
        <span className="text-gray-300 text-sm">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 px-3 py-1.5 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
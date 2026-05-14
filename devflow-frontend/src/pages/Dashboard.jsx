import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const stats = [
  { label: 'Total Pipelines', value: '24', icon: '⚙️', color: 'blue' },
  { label: 'Passed', value: '18', icon: '✅', color: 'green' },
  { label: 'Failed', value: '6', icon: '❌', color: 'red' },
  { label: 'Open Issues', value: '9', icon: '🐛', color: 'yellow' },
]

const recentPipelines = [
  { id: 1, branch: 'main', status: 'passed', time: '2 mins ago', commit: 'fix: auth token bug', author: 'Anjali' },
  { id: 2, branch: 'dev', status: 'failed', time: '5 mins ago', commit: 'feat: webhook handler', author: 'Ravi' },
  { id: 3, branch: 'feature/ui', status: 'running', time: '8 mins ago', commit: 'ui: dashboard layout', author: 'Priya' },
  { id: 4, branch: 'hotfix/db', status: 'passed', time: '1 hr ago', commit: 'fix: db connection', author: 'Anjali' },
  { id: 5, branch: 'release/v1', status: 'pending', time: '2 hrs ago', commit: 'chore: version bump', author: 'Ravi' },
]

const recentIssues = [
  { id: 1, title: 'Pipeline failed on main branch', priority: 'high', status: 'open', assignee: 'Anjali' },
  { id: 2, title: 'Auth token expiry too short', priority: 'medium', status: 'in-progress', assignee: 'Ravi' },
  { id: 3, title: 'DB connection timeout', priority: 'high', status: 'open', assignee: 'Priya' },
]

const statusBadge = (status) => {
  const map = {
    passed:  'bg-green-900/40 text-green-400 border border-green-900',
    failed:  'bg-red-900/40 text-red-400 border border-red-900',
    running: 'bg-yellow-900/40 text-yellow-400 border border-yellow-900',
    pending: 'bg-gray-800 text-gray-400 border border-gray-700',
  }
  return map[status] || map.pending
}

const priorityBadge = (priority) => {
  const map = {
    high:   'bg-red-900/40 text-red-400',
    medium: 'bg-yellow-900/40 text-yellow-400',
    low:    'bg-green-900/40 text-green-400',
  }
  return map[priority] || ''
}

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Passed',
      data: [4, 6, 3, 5, 7, 2, 4],
      backgroundColor: '#22c55e',
      borderRadius: 6,
    },
    {
      label: 'Failed',
      data: [1, 2, 1, 0, 2, 1, 0],
      backgroundColor: '#ef4444',
      borderRadius: 6,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#9ca3af' } },
  },
  scales: {
    x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
    y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
  },
}

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Here's what's happening with your pipelines today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{s.icon}</span>
              </div>
              <p className={`text-3xl font-bold text-${s.color}-400 mb-1`}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Chart + Recent Issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">Pipeline Activity (This Week)</h2>
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Recent Issues */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">Recent Issues</h2>
            <div className="space-y-3">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="bg-gray-800 rounded-lg px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-white">{issue.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${priorityBadge(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">👤 {issue.assignee}</span>
                    <span className="text-xs text-blue-400">{issue.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Pipelines */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Recent Pipelines</h2>
          <div className="space-y-2">
            {recentPipelines.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3 hover:bg-gray-750 transition">
                <div className="flex items-center gap-4">
                  <span className="text-blue-400 font-mono text-sm bg-blue-950 px-2 py-0.5 rounded">
                    {p.branch}
                  </span>
                  <span className="text-gray-300 text-sm">{p.commit}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 text-xs hidden md:block">👤 {p.author}</span>
                  <span className="text-gray-500 text-xs">{p.time}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusBadge(p.status)}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
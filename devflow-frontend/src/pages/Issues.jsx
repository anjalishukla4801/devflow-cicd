import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const allIssues = [
  { id: 1, title: 'Pipeline failed on main branch', description: 'The main branch pipeline failed during integration tests. Database connection timeout occurred.', priority: 'high', status: 'open', assignee: 'Anjali', createdBy: 'System', time: '2 mins ago', pipeline: 'main', repo: 'devflow-backend', tags: ['auto-created', 'database'] },
  { id: 2, title: 'Auth token expiry too short', description: 'JWT tokens are expiring too quickly causing users to be logged out frequently.', priority: 'medium', status: 'in-progress', assignee: 'Ravi', createdBy: 'Anjali', time: '1 hr ago', pipeline: 'dev', repo: 'devflow-backend', tags: ['auth', 'bug'] },
  { id: 3, title: 'DB connection pool exhausted', description: 'Under high load the database connection pool gets exhausted causing 500 errors.', priority: 'high', status: 'open', assignee: 'Priya', createdBy: 'System', time: '3 hrs ago', pipeline: 'hotfix/db', repo: 'devflow-backend', tags: ['auto-created', 'performance'] },
  { id: 4, title: 'Webhook not triggering pipeline', description: 'GitHub webhooks are not triggering the pipeline service. Needs investigation.', priority: 'high', status: 'open', assignee: 'Anjali', createdBy: 'Ravi', time: '5 hrs ago', pipeline: 'dev', repo: 'devflow-backend', tags: ['webhook'] },
  { id: 5, title: 'Dashboard chart not loading', description: 'The bar chart on the dashboard shows blank on first load. Requires page refresh.', priority: 'low', status: 'closed', assignee: 'Priya', createdBy: 'Priya', time: '1 day ago', pipeline: 'feature/ui', repo: 'devflow-frontend', tags: ['ui', 'bug'] },
  { id: 6, title: 'Docker compose health check failing', description: 'Redis health check in docker-compose is intermittently failing on startup.', priority: 'medium', status: 'in-progress', assignee: 'Ravi', createdBy: 'System', time: '2 days ago', pipeline: 'main', repo: 'devflow-backend', tags: ['auto-created', 'docker'] },
]

const priorityConfig = {
  high:   { bg: 'bg-red-900/40 text-red-400 border border-red-900',    dot: 'bg-red-400' },
  medium: { bg: 'bg-yellow-900/40 text-yellow-400 border border-yellow-900', dot: 'bg-yellow-400' },
  low:    { bg: 'bg-green-900/40 text-green-400 border border-green-900', dot: 'bg-green-400' },
}

const statusConfig = {
  'open':        { bg: 'bg-blue-900/40 text-blue-400 border border-blue-900', label: 'Open' },
  'in-progress': { bg: 'bg-yellow-900/40 text-yellow-400 border border-yellow-900', label: 'In Progress' },
  'closed':      { bg: 'bg-gray-800 text-gray-400 border border-gray-700', label: 'Closed' },
}

const members = ['All', 'Anjali', 'Ravi', 'Priya']

export default function Issues() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = allIssues.filter(issue => {
    const matchStatus = filter === 'all' || issue.status === filter
    const matchPriority = priorityFilter === 'all' || issue.priority === priorityFilter
    const matchAssignee = assigneeFilter === 'All' || issue.assignee === assigneeFilter
    const matchSearch = issue.title.toLowerCase().includes(search.toLowerCase())
    // Developers only see their assigned issues
    const matchRole = user?.role === 'developer' ? issue.assignee === user?.name : true
    return matchStatus && matchPriority && matchAssignee && matchSearch && matchRole
  })

  if (selected) {
    return <IssueDetail issue={selected} onBack={() => setSelected(null)} user={user} />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Issues</h1>
            <p className="text-gray-400 text-sm mt-1">
              Track and resolve pipeline issues
              {user?.role === 'developer' && ' — showing your assigned issues'}
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition">
            + New Issue
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Open', value: allIssues.filter(i => i.status === 'open').length, color: 'text-blue-400' },
            { label: 'In Progress', value: allIssues.filter(i => i.status === 'in-progress').length, color: 'text-yellow-400' },
            { label: 'Closed', value: allIssues.filter(i => i.status === 'closed').length, color: 'text-gray-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {/* Status filter */}
            {['all', 'open', 'in-progress', 'closed'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`text-xs px-3 py-2 rounded-lg capitalize transition ${
                  filter === s ? 'bg-blue-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                }`}>
                {s}
              </button>
            ))}
            {/* Priority filter */}
            {['all', 'high', 'medium', 'low'].map(p => (
              <button key={p} onClick={() => setPriorityFilter(p)}
                className={`text-xs px-3 py-2 rounded-lg capitalize transition ${
                  priorityFilter === p ? 'bg-purple-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                }`}>
                {p}
              </button>
            ))}
            {/* Assignee filter — only for admin/manager */}
            {user?.role !== 'developer' && (
              <select
                value={assigneeFilter}
                onChange={e => setAssigneeFilter(e.target.value)}
                className="text-xs bg-gray-900 border border-gray-800 text-gray-400 px-3 py-2 rounded-lg focus:outline-none"
              >
                {members.map(m => <option key={m}>{m}</option>)}
              </select>
            )}
          </div>
        </div>

        {/* Issues list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-gray-900 border border-gray-800 rounded-xl">
              No issues found
            </div>
          ) : (
            filtered.map(issue => (
              <div
                key={issue.id}
                onClick={() => setSelected(issue)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-gray-700 cursor-pointer transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      {issue.tags.includes('auto-created') && (
                        <span className="text-xs bg-purple-900/40 text-purple-400 border border-purple-900 px-2 py-0.5 rounded-full">
                          🤖 auto-created
                        </span>
                      )}
                      <span className="text-white font-medium">{issue.title}</span>
                    </div>
                    <p className="text-gray-500 text-sm truncate">{issue.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500">📁 {issue.repo}</span>
                      <span className="text-xs text-gray-500">⚙️ {issue.pipeline}</span>
                      <span className="text-xs text-gray-500">👤 {issue.assignee}</span>
                      <span className="text-xs text-gray-500">{issue.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${priorityConfig[issue.priority].bg}`}>
                      {issue.priority}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusConfig[issue.status].bg}`}>
                      {statusConfig[issue.status].label}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Issue Detail
function IssueDetail({ issue, onBack, user }) {
  const [status, setStatus] = useState(issue.status)

  const activity = [
    { action: 'Issue created automatically from pipeline failure', time: issue.time, by: 'System' },
    { action: `Assigned to ${issue.assignee}`, time: '1 min later', by: 'System' },
    { action: 'Status changed to In Progress', time: '30 mins ago', by: issue.assignee },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition">
          ← Back to Issues
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* Main content */}
          <div className="col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                {issue.tags.includes('auto-created') && (
                  <span className="text-xs bg-purple-900/40 text-purple-400 border border-purple-900 px-2 py-0.5 rounded-full">
                    🤖 auto-created
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-white mb-3">{issue.title}</h1>
              <p className="text-gray-400 text-sm leading-relaxed">{issue.description}</p>
              <div className="flex gap-2 mt-4">
                {issue.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Linked Pipeline */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-300 mb-4">Linked Pipeline</h2>
              <div className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-blue-400 font-mono text-sm">{issue.pipeline}</span>
                  <span className="text-gray-500 text-xs ml-3">{issue.repo}</span>
                </div>
                <span className="text-xs bg-red-900/40 text-red-400 border border-red-900 px-2 py-1 rounded-full">
                  failed
                </span>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-300 mb-4">Activity</h2>
              <div className="space-y-4">
                {activity.map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-300 text-sm">{a.action}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{a.by} · {a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status update */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-300 mb-3">Status</h2>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                disabled={user?.role === 'developer' && issue.assignee !== user?.name}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              {status !== issue.status && (
                <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition">
                  Update Status
                </button>
              )}
            </div>

            {/* Details */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-300">Details</h2>
              {[
                { label: 'Priority', value: issue.priority, color: priorityConfig[issue.priority].bg },
                { label: 'Assignee', value: '👤 ' + issue.assignee },
                { label: 'Created by', value: issue.createdBy },
                { label: 'Repository', value: issue.repo },
                { label: 'Created', value: issue.time },
              ].map(d => (
                <div key={d.label}>
                  <p className="text-gray-600 text-xs mb-1">{d.label}</p>
                  {d.color ? (
                    <span className={`text-xs px-2 py-1 rounded-full border ${d.color}`}>{d.value}</span>
                  ) : (
                    <p className="text-gray-300 text-sm">{d.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
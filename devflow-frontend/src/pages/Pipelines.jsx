import { useState } from 'react'
import Navbar from '../components/Navbar'

const allPipelines = [
  { id: 1, branch: 'main', status: 'passed', commit: 'fix: auth token bug', author: 'Anjali', time: '2 mins ago', duration: '1m 23s', repo: 'devflow-backend' },
  { id: 2, branch: 'dev', status: 'failed', commit: 'feat: webhook handler', author: 'Ravi', time: '5 mins ago', duration: '0m 45s', repo: 'devflow-backend' },
  { id: 3, branch: 'feature/ui', status: 'running', commit: 'ui: dashboard layout', author: 'Priya', time: '8 mins ago', duration: '2m 10s', repo: 'devflow-frontend' },
  { id: 4, branch: 'hotfix/db', status: 'passed', commit: 'fix: db connection pool', author: 'Anjali', time: '1 hr ago', duration: '1m 05s', repo: 'devflow-backend' },
  { id: 5, branch: 'release/v1', status: 'pending', commit: 'chore: version bump', author: 'Ravi', time: '2 hrs ago', duration: '-', repo: 'devflow-frontend' },
  { id: 6, branch: 'main', status: 'passed', commit: 'docs: update readme', author: 'Priya', time: '3 hrs ago', duration: '0m 55s', repo: 'devflow-frontend' },
  { id: 7, branch: 'dev', status: 'failed', commit: 'feat: issue auto-create', author: 'Anjali', time: '5 hrs ago', duration: '1m 30s', repo: 'devflow-backend' },
  { id: 8, branch: 'feature/auth', status: 'passed', commit: 'feat: jwt refresh', author: 'Ravi', time: '1 day ago', duration: '1m 12s', repo: 'devflow-backend' },
]

const statusConfig = {
  passed:  { bg: 'bg-green-900/40 text-green-400 border-green-900', dot: 'bg-green-400', label: 'Passed' },
  failed:  { bg: 'bg-red-900/40 text-red-400 border-red-900',       dot: 'bg-red-400',   label: 'Failed' },
  running: { bg: 'bg-yellow-900/40 text-yellow-400 border-yellow-900', dot: 'bg-yellow-400 animate-pulse', label: 'Running' },
  pending: { bg: 'bg-gray-800 text-gray-400 border-gray-700',       dot: 'bg-gray-400',  label: 'Pending' },
}

export default function Pipelines() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = allPipelines.filter(p => {
    const matchStatus = filter === 'all' || p.status === filter
    const matchSearch = p.branch.includes(search) || p.commit.includes(search) || p.author.includes(search)
    return matchStatus && matchSearch
  })

  if (selected) {
    return <PipelineDetail pipeline={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Pipelines</h1>
            <p className="text-gray-400 text-sm mt-1">Monitor all your CI/CD pipeline runs</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{filtered.length} pipelines</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by branch, commit or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 flex-1"
          />
          {/* Status filter */}
          <div className="flex gap-2">
            {['all', 'passed', 'failed', 'running', 'pending'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs px-3 py-2 rounded-lg capitalize transition ${
                  filter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: allPipelines.length, color: 'text-white' },
            { label: 'Passed', value: allPipelines.filter(p => p.status === 'passed').length, color: 'text-green-400' },
            { label: 'Failed', value: allPipelines.filter(p => p.status === 'failed').length, color: 'text-red-400' },
            { label: 'Running', value: allPipelines.filter(p => p.status === 'running').length, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pipeline list */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-800 text-xs text-gray-500 font-medium uppercase tracking-wide">
            <div className="col-span-1">Status</div>
            <div className="col-span-3">Branch / Commit</div>
            <div className="col-span-2">Repository</div>
            <div className="col-span-2">Author</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-2">Time</div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No pipelines found</div>
          ) : (
            filtered.map((p) => {
              const cfg = statusConfig[p.status]
              return (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition items-center"
                >
                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${cfg.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                      {cfg.label}
                    </span>
                  </div>
                  {/* Branch + Commit */}
                  <div className="col-span-3">
                    <p className="text-blue-400 font-mono text-sm">{p.branch}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{p.commit}</p>
                  </div>
                  {/* Repo */}
                  <div className="col-span-2">
                    <span className="text-gray-300 text-xs bg-gray-800 px-2 py-1 rounded">{p.repo}</span>
                  </div>
                  {/* Author */}
                  <div className="col-span-2">
                    <span className="text-gray-300 text-sm">👤 {p.author}</span>
                  </div>
                  {/* Duration */}
                  <div className="col-span-2">
                    <span className="text-gray-400 text-sm">⏱ {p.duration}</span>
                  </div>
                  {/* Time */}
                  <div className="col-span-2">
                    <span className="text-gray-500 text-xs">{p.time}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

// Pipeline Detail View
function PipelineDetail({ pipeline, onBack }) {
  const cfg = statusConfig[pipeline.status]
  const logs = pipeline.status === 'failed'
    ? [
        '✅ Cloning repository...',
        '✅ Installing dependencies...',
        '✅ Running tests...',
        '❌ Error: Cannot connect to database',
        '❌ Pipeline failed at step: integration-test',
      ]
    : [
        '✅ Cloning repository...',
        '✅ Installing dependencies...',
        '✅ Running tests...',
        '✅ Building project...',
        '✅ Pipeline completed successfully!',
      ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
        >
          ← Back to Pipelines
        </button>

        {/* Pipeline header */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-blue-400 font-mono text-lg">{pipeline.branch}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${cfg.bg}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{pipeline.commit}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Repository', value: pipeline.repo },
              { label: 'Author', value: pipeline.author },
              { label: 'Duration', value: pipeline.duration },
              { label: 'Triggered', value: pipeline.time },
            ].map(item => (
              <div key={item.label}>
                <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                <p className="text-white text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Pipeline Steps</h2>
          <div className="flex gap-2">
            {['Clone', 'Install', 'Test', 'Build', 'Deploy'].map((step, i) => {
              const isDone = pipeline.status === 'passed'
              const isFailed = pipeline.status === 'failed' && i >= 3
              const isRunning = pipeline.status === 'running' && i === 2
              return (
                <div key={step} className="flex-1 text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm ${
                    isFailed ? 'bg-red-900/50 text-red-400' :
                    isRunning ? 'bg-yellow-900/50 text-yellow-400' :
                    isDone || i < 3 ? 'bg-green-900/50 text-green-400' :
                    'bg-gray-800 text-gray-600'
                  }`}>
                    {isFailed ? '✗' : isRunning ? '◌' : (isDone || i < 3) ? '✓' : '○'}
                  </div>
                  <p className="text-xs text-gray-400">{step}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Build Logs</h2>
          <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm space-y-2">
            {logs.map((log, i) => (
              <p key={i} className={log.startsWith('❌') ? 'text-red-400' : 'text-green-400'}>
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
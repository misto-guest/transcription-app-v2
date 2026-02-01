'use client'

import { useEffect, useState } from 'react'

export default function StatusPage() {
  const [status, setStatus] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [apps, setApps] = useState([
    {
      name: 'Transcription App',
      url: 'https://transcription-app-woad.vercel.app',
      description: 'YouTube & Spotify transcription with AI takeaways',
      status: 'live'
    },
    {
      name: 'GLM Usage Dashboard',
      url: 'https://glm-dashboard-umber.vercel.app',
      description: 'Monitor GLM 4.7 usage and costs',
      status: 'live'
    }
  ])

  useEffect(() => {
    fetch('/api/deploy-status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error('Failed to fetch status:', err))

    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data.history || [])
        setLoadingHistory(false)
      })
      .catch(err => {
        console.error('Failed to fetch history:', err)
        setLoadingHistory(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎯 Production Apps Status
          </h1>
          <p className="text-white/90 text-lg">
            All deployed applications and their status
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {apps.map((app, idx) => (
            <a
              key={idx}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {app.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {app.description}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  app.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {app.status === 'live' ? '✅ LIVE' : '⚠️ CHECK'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-mono">{app.url.replace('https://', '')}</span>
                </div>
                <div className="text-blue-600 font-semibold text-sm flex items-center gap-1">
                  Open
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14M10 10l6 6" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🔧</span>
            <span>System Status</span>
          </h3>

          {status ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-purple-600 font-medium">Agent</p>
                  <p className="text-2xl font-bold text-purple-800">{status.agent}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-600 font-medium">Model</p>
                  <p className="text-lg font-bold text-blue-800">{status.model}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-600 font-medium">Status</p>
                  <p className="text-2xl font-bold text-green-800">{status.status}</p>
                </div>
              </div>

              {status.runtime && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Runtime Details</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Host</p>
                      <p className="font-mono text-gray-800 text-xs">{status.runtime.host}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">OS</p>
                      <p className="font-mono text-gray-800 text-xs">{status.runtime.os}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Node</p>
                      <p className="font-mono text-gray-800 text-xs">{status.runtime.node}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Session</p>
                      <p className="font-mono text-gray-800 text-xs">{status.runtime.sessionKey?.split(':').slice(0, 2).join(':')}</p>
                    </div>
                  </div>
                </div>
              )}

              {status.capabilities && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {status.capabilities.map((cap: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <p className="text-gray-500">Loading status...</p>
              </div>
            </div>
          )}
        </div>

        {/* Auto-Update Notes Section */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>📝</span>
            <span>Auto-Update Notes</span>
          </h3>
          <div className="text-gray-700 space-y-2">
            <p>
              <strong className="text-green-700">✅ YES</strong> - This system still automatically updates notes!
            </p>
            <p className="text-sm mt-3">
              The PARA memory system with atomic facts is fully operational:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-gray-600">
              <li>Daily notes capture all events and decisions</li>
              <li>Heartbeat process extracts atomic facts every 2-4 hours</li>
              <li>Facts stored in <code className="bg-gray-100 px-2 py-1 rounded">knowledge/facts.json</code></li>
              <li>Memory decay algorithm prioritizes important information</li>
              <li>Tiered retrieval optimizes context window usage</li>
              <li>All deployments and URLs saved to memory</li>
            </ul>
          </div>
        </div>

        {/* Complete History Timeline */}
        <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span>📜</span>
              <span>Complete Build History</span>
            </h3>
            <span className="text-sm text-gray-500">
              Auto-updates on every deploy • {history.length} events
            </span>
          </div>

          {loadingHistory ? (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <p className="text-gray-500">Loading history...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4">
              {history.map((item, idx) => {
                const typeIcon = {
                  commit: '🔨',
                  deployment: '🚀',
                  documentation: '📄',
                  milestone: '⭐',
                }[item.type] || '📌'

                const typeColor = {
                  commit: 'border-blue-200 bg-blue-50',
                  deployment: 'border-green-200 bg-green-50',
                  documentation: 'border-purple-200 bg-purple-50',
                  milestone: 'border-yellow-200 bg-yellow-50',
                }[item.type] || 'border-gray-200 bg-gray-50'

                const date = new Date(item.date)
                const dateStr = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
                const timeStr = date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className={`border-l-4 ${typeColor} rounded-lg p-4 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{typeIcon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.title}</h4>
                          {item.author && (
                            <span className="text-xs text-gray-500">by {item.author}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>{dateStr}</div>
                        <div>{timeStr}</div>
                        {item.commit && (
                          <div className="font-mono text-blue-600">{item.commit}</div>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                    )}

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View →
                      </a>
                    )}

                    {item.status && (
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                        item.status === 'success' ? 'bg-green-100 text-green-800' :
                        item.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white/80 text-sm">
          <p>
            All apps running on Vercel • Built with Next.js 15 • AI-powered by zai/glm-4.7
          </p>
        </div>
      </div>
    </div>
  )
}

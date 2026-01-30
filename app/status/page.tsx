'use client'

import { useEffect, useState } from 'react'

interface DeploymentInfo {
  deployedAt: string
  commit: string
  message: string
  environment: string
  region: string
}

interface LogEntry {
  time: string
  message: string
  level?: string
}

export default function StatusPage() {
  const [deployInfo, setDeployInfo] = useState<DeploymentInfo | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())

  const logs: LogEntry[] = [
    { time: '2026-01-30 12:39 UTC', message: '✅ Status page deployed as Next.js route', level: 'success' },
    { time: '2026-01-30 11:38 UTC', message: '✅ Status page created in public folder (404 issue)', level: 'warning' },
    { time: '2026-01-30 11:29 UTC', message: '✅ Auto-deploy test pushed to GitHub (commit: bde5d17)', level: 'success' },
    { time: '2026-01-30 11:00 UTC', message: '✅ GitHub repo connected to Vercel for auto-deploy', level: 'success' },
    { time: '2026-01-30 10:13 UTC', message: '✅ Transcription app deployed with header improvements', level: 'success' },
    { time: '2026-01-30 09:30 UTC', message: '🔧 Fixed TypeScript errors in API routes', level: 'success' },
    { time: '2026-01-30 08:19 UTC', message: '📝 Added persistent header navigation and improved UI', level: 'success' },
  ]

  useEffect(() => {
    // Fetch deployment info
    fetch('/api/deploy-status')
      .then(res => res.json())
      .then(data => {
        if (data.deploy) {
          setDeployInfo(data.deploy)
        }
      })
      .catch(err => console.log('Could not fetch deployment info'))

    // Update timestamp every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date().toISOString())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎯 Dmitry Agent Status</h1>
          <p className="text-gray-600">Professional AI Assistant • Clawdbot Runtime • Model: zai/glm-4.7</p>
          <span className="inline-block mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            ● Online
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* System Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 System Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Agent Name</span>
                <span className="font-semibold text-gray-900 text-sm">Dmitry</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Model</span>
                <span className="font-semibold text-gray-900 text-sm">zai/glm-4.7</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Host</span>
                <span className="font-semibold text-gray-900 text-sm">North's Mac mini</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 text-sm">Runtime</span>
                <span className="font-semibold text-gray-900 text-sm">agent=dmitry</span>
              </div>
            </div>
          </div>

          {/* Deployment Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Deployment Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Latest Deploy</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {deployInfo ? new Date(deployInfo.deployedAt).toLocaleString() : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Git Commit</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {deployInfo ? deployInfo.commit.substring(0, 7) : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Auto-Deploy</span>
                <span className="font-semibold text-green-600 text-sm">✅ Enabled</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 text-sm">Repo</span>
                <a
                  href="https://github.com/misto-guest/transcription-app-v2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 text-sm hover:underline"
                >
                  GitHub →
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Transcription App</span>
                <a
                  href="/"
                  className="font-semibold text-purple-600 text-sm hover:underline"
                >
                  Open App →
                </a>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">Documentation</span>
                <a
                  href="https://github.com/misto-guest/transcription-app-v2/blob/main/DOCS.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 text-sm hover:underline"
                >
                  View Docs →
                </a>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 text-sm">Deploy History</span>
                <a
                  href="https://vercel.com/bram-1592s-projects/transcription-app/deployments"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 text-sm hover:underline"
                >
                  Vercel →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">📋 Recent Activity Log</h2>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  log.level === 'error' ? 'border-red-500 bg-red-50' :
                  log.level === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50'
                }`}
              >
                <div className="text-xs text-gray-600 mb-1">{log.time}</div>
                <div className="text-sm text-gray-900">{log.message}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-700 text-sm">
            <strong>Active Projects:</strong> Transcription App (V2) •
            <a href="https://github.com/misto-guest/transcription-app-v2" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline ml-1">GitHub Repo</a> •
            <a href="https://vercel.com/bram-1592s-projects/transcription-app" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline ml-1">Vercel Dashboard</a>
          </p>
        </div>

        {/* Last Updated */}
        <div className="text-center text-white text-sm mt-6">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  )
}

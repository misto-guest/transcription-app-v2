'use client'

import { useEffect, useState } from 'react'

type SystemStatus = {
  status: string
  timestamp: string
  integrations: {
    youtubeTranscript: {
      available: boolean
      status: string
      version: string
      type: string
      description: string
    }
    puppeteer: {
      available: boolean
      status: string
      fallbackLevel: number
      type: string
      description: string
    }
    assemblyAI: {
      available: boolean
      status: string
      fallbackLevel: number
      type: string
      description: string
    }
  }
  metrics: {
    usage: {
      totalRequests: number
      nodejsPackageUsage: number
      assemblyAIUsage: number
      puppeteerUsage: number
      averageResponseTime: number
      successRate: number
    }
    activeMethod: string
    fallbackChain: string[]
  }
  health: {
    overall: string
    issues: string[]
  }
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setStatus(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!status) {
    return null
  }

  const getStatusColor = (s: string) => {
    if (s === 'operational' || s === 'ready' || s === 'configured') return 'bg-green-500'
    if (s === 'healthy') return 'bg-green-500'
    if (s === 'not_installed' || s === 'not_configured') return 'bg-gray-400'
    return 'bg-red-500'
  }

  const getStatusBadge = (s: string) => {
    if (s === 'operational' || s === 'ready' || s === 'configured') return '✅'
    if (s === 'healthy') return '🟢'
    if (s === 'not_installed' || s === 'not_configured') return '⚪'
    return '❌'
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl p-6 mb-6 text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">📊 System Status Dashboard</h2>
          <p className="text-slate-400 text-sm">Real-time integration and fallback status</p>
        </div>
        <button
          onClick={fetchStatus}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Overall Health */}
      <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status.health.overall)}`}></div>
            <span className="font-semibold text-lg">
              {status.health.overall === 'healthy' ? 'System Healthy' : 'System Issues Detected'}
            </span>
          </div>
          <span className="text-slate-400 text-sm">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* API Integration Status */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* YouTube Transcript Node.js */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-400">YouTube Transcript</h3>
            <span className="text-2xl">
              {getStatusBadge(status.integrations.youtubeTranscript.status)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={status.integrations.youtubeTranscript.available ? 'text-green-400 font-medium' : 'text-red-400'}>
                {status.integrations.youtubeTranscript.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Version:</span>
              <span className="font-mono">{status.integrations.youtubeTranscript.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Type:</span>
              <span>{status.integrations.youtubeTranscript.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fallback Level:</span>
              <span className="text-yellow-400 font-medium">1 (Primary)</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">{status.integrations.youtubeTranscript.description}</p>
        </div>

        {/* Puppeteer Fallback */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-purple-400">Puppeteer Automation</h3>
            <span className="text-2xl">
              {getStatusBadge(status.integrations.puppeteer.status)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={status.integrations.puppeteer.available ? 'text-green-400 font-medium' : 'text-red-400'}>
                {status.integrations.puppeteer.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fallback Level:</span>
              <span className="text-orange-400 font-medium">3 (Emergency)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Type:</span>
              <span>{status.integrations.puppeteer.type}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">{status.integrations.puppeteer.description}</p>
        </div>

        {/* AssemblyAI */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-green-400">AssemblyAI API</h3>
            <span className="text-2xl">
              {getStatusBadge(status.integrations.assemblyAI.status)}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={status.integrations.assemblyAI.available ? 'text-green-400 font-medium' : 'text-red-400'}>
                {status.integrations.assemblyAI.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fallback Level:</span>
              <span className="text-yellow-400 font-medium">2 (Backup)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Type:</span>
              <span>{status.integrations.assemblyAI.type}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">{status.integrations.assemblyAI.description}</p>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mb-6">
        <h3 className="font-semibold text-lg mb-4">📈 Real-Time Usage Metrics</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{status.metrics.usage.totalRequests}</div>
            <div className="text-xs text-slate-400">Total Requests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{status.metrics.usage.successRate.toFixed(1)}%</div>
            <div className="text-xs text-slate-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{status.metrics.usage.averageResponseTime.toFixed(2)}s</div>
            <div className="text-xs text-slate-400">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{status.metrics.usage.nodejsPackageUsage}%</div>
            <div className="text-xs text-slate-400">Node.js Package Usage</div>
          </div>
        </div>
      </div>

      {/* Method Distribution */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h3 className="font-semibold text-lg mb-4">🎯 Method Distribution</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>YouTube Transcript (Node.js)</span>
              <span className="text-blue-400 font-medium">{status.metrics.usage.nodejsPackageUsage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${status.metrics.usage.nodejsPackageUsage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>AssemblyAI API</span>
              <span className="text-green-400 font-medium">{status.metrics.usage.assemblyAIUsage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${status.metrics.usage.assemblyAIUsage}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Puppeteer Automation</span>
              <span className="text-purple-400 font-medium">{status.metrics.usage.puppeteerUsage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${status.metrics.usage.puppeteerUsage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Chain */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h3 className="font-semibold text-lg mb-3">🔄 Active Fallback Chain</h3>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          {status.metrics.fallbackChain.map((method, index) => (
            <div key={index} className="flex items-center">
              <span className={`px-3 py-1 rounded ${
                method === status.metrics.activeMethod
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {method}
                {method === status.metrics.activeMethod && ' ⭐'}
              </span>
              {index < status.metrics.fallbackChain.length - 1 && (
                <span className="text-slate-500">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Currently using: <span className="text-blue-400 font-medium">{status.metrics.activeMethod}</span>
        </p>
      </div>
    </div>
  )
}

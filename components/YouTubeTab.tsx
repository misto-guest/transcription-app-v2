'use client'

import { useState } from 'react'

export default function YouTubeTab() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleTranscribe = async () => {
    if (!url.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transcribe')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🔗 Paste Your YouTube URL Here:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTranscribe()}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleTranscribe}
            disabled={loading || !url.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? '⏳ Processing...' : '🚀 Transcribe'}
          </button>
        </div>

        {/* Example URL */}
        <p className="text-sm text-gray-600 mt-2">
          Example: <code className="bg-gray-100 px-2 py-1 rounded">https://www.youtube.com/watch?v=AWxeTJp_lyk</code>
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📊 Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-900">Characters</p>
                <p className="text-blue-700">{result.stats.characters.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium text-blue-900">Words</p>
                <p className="text-blue-700">{result.stats.words.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium text-blue-900">Source</p>
                <p className="text-blue-700">{result.source === 'youtube-transcript-api' ? 'YouTube API' : 'AssemblyAI'}</p>
              </div>
              <div>
                <p className="font-medium text-blue-900">Fallback</p>
                <p className="text-blue-700">{result.fallbackUsed ? '⚠️ Yes' : '✅ No'}</p>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          {result.takeaways && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-bold text-yellow-900 mb-4 text-lg">🎯 10 Key Takeaways</h3>
              <div className="prose prose-yellow max-w-none">
                <div className="whitespace-pre-wrap text-yellow-900 font-medium leading-relaxed">
                  {result.takeaways}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-yellow-300">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Tip:</strong> Use these takeaways to improve your workflows and automation strategies.
                </p>
              </div>
            </div>
          )}

          {/* Full Transcript */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">📝 Full Transcript</h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {result.transcript}
              </p>
            </div>

            {/* Download Button */}
            <div className="mt-4 pt-4 border-t border-gray-300">
              <button
                onClick={() => {
                  const blob = new Blob([result.transcript], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `transcript-${result.videoId}.txt`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                📥 Download Transcript
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="animate-pulse">
            <p className="text-blue-900 font-medium">⏳ Extracting transcript...</p>
            <p className="text-blue-700 text-sm mt-2">This may take up to 60 seconds</p>
          </div>
        </div>
      )}
    </div>
  )
}

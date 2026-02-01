'use client'

import { useState, useRef } from 'react'
import Header from './components/Header'

type ApiResult = {
  transcript?: string
  takeaways?: string
  filename?: string
  duration?: number
  error?: string
  note?: string
  size?: number
  source?: string
  fallbackUsed?: boolean
  stats?: {
    characters: number
    words: number
  }
  videoId?: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'youtube' | 'spotify' | 'upload'>('youtube')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [result, setResult] = useState<ApiResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleYoutube = async () => {
    if (!youtubeUrl) return
    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl })
      })

      const data: ApiResult = await res.json()

      if (data.error) {
        setError(data.error)
      } else if (data.transcript) {
        setResult(data)
      } else if (data.note) {
        setResult(data)
      } else {
        setError('No transcript found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleSpotify = async () => {
    if (!spotifyUrl) return
    setLoading(true)
    setResult(null)
    setError('')

    try {
      const res = await fetch('/api/spotify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: spotifyUrl })
      })

      const data: ApiResult = await res.json()

      if (data.error) {
        setError(data.error)
      } else if (data.transcript) {
        setResult(data)
      } else {
        setError('Processing complete')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileInputRef.current?.files?.[0]) return

    setLoading(true)
    setResult(null)
    setError('')

    const file = fileInputRef.current.files[0]
    const formData = new FormData()
    formData.append('audio', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data: ApiResult = await res.json()

      if (data.error) {
        setError(data.error)
      } else if (data.transcript) {
        setResult(data)
      } else {
        setError('No transcript generated')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(2)} MB`
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Transcribe Any Audio
            </h1>
            <p className="text-white/90 text-base md:text-lg">
              Paste your URL below and get a transcript in seconds
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Powered by AssemblyAI
            </div>
          </div>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 flex-wrap">
          <button
            onClick={() => {
              setActiveTab('youtube')
              setResult(null)
              setError('')
            }}
            className={`flex-1 py-3 px-3 md:px-6 rounded-lg font-semibold transition-all text-sm md:text-base ${
              activeTab === 'youtube'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => {
              setActiveTab('spotify')
              setResult(null)
              setError('')
            }}
            className={`flex-1 py-3 px-3 md:px-6 rounded-lg font-semibold transition-all text-sm md:text-base ${
              activeTab === 'spotify'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Spotify
          </button>
          <button
            onClick={() => {
              setActiveTab('upload')
              setResult(null)
              setError('')
            }}
            className={`flex-1 py-3 px-3 md:px-6 rounded-lg font-semibold transition-all text-sm md:text-base ${
              activeTab === 'upload'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Upload File
          </button>
        </div>

        {/* YouTube Tab */}
        {activeTab === 'youtube' && (
          <div id="youtube-section" className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  YouTube Transcript
                </h2>
                <p className="text-sm text-gray-600">Download and transcribe any YouTube video</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
              <p className="font-semibold mb-3 text-base">📋 Supported URL Formats:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-mono text-xs bg-blue-100 px-2 py-1 rounded">youtube.com/watch?v=ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-mono text-xs bg-blue-100 px-2 py-1 rounded">youtu.be/ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-mono text-xs bg-blue-100 px-2 py-1 rounded">youtube.com/embed/ID</span>
                </li>
              </ul>
              <p className="mt-3 text-xs text-blue-700">💡 Works with videos, shorts, and most public content</p>
            </div>

            {/* URL Input Section - Prominent */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
              <label htmlFor="youtube-url" className="block text-sm font-bold text-gray-800 mb-3">
                🔗 Paste Your YouTube URL Here:
              </label>
              <div className="flex gap-3">
                <input
                  id="youtube-url"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=AWxeTJp_lyk"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-gray-800 text-base"
                />
                <button
                  onClick={handleYoutube}
                  disabled={loading || !youtubeUrl}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base whitespace-nowrap shadow-lg hover:shadow-xl"
                >
                  {loading ? '⏳ Processing...' : '🚀 Transcribe'}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-600">
                Example: <code className="bg-white px-2 py-1 rounded font-mono text-purple-600">https://www.youtube.com/watch?v=AWxeTJp_lyk</code>
              </p>
            </div>
          </div>
        )}

        {/* Spotify Tab */}
        {activeTab === 'spotify' && (
          <div id="spotify-section" className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Spotify Audio Transcription
                </h2>
                <p className="text-sm text-gray-600">Download and transcribe tracks, episodes & playlists</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-sm text-green-800">
              <p className="font-semibold mb-3 text-base">📋 Supported URL Formats:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-mono text-xs bg-green-100 px-2 py-1 rounded">spotify.com/track/TRACK_ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-mono text-xs bg-green-100 px-2 py-1 rounded">spotify.com/episode/EPISODE_ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-mono text-xs bg-green-100 px-2 py-1 rounded">spotify.com/playlist/PLAYLIST_ID</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
              <p className="font-semibold mb-2">⚠️ DRM-Protected Episodes</p>
              <p>Some Spotify episodes are DRM-protected and can't be downloaded directly. Use <strong>NoteBurner</strong> to record them, then upload via the "Upload File" tab.</p>
            </div>

            {/* URL Input Section - Prominent */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <label htmlFor="spotify-url" className="block text-sm font-bold text-gray-800 mb-3">
                🔗 Paste Your Spotify URL Here:
              </label>
              <div className="flex gap-3">
                <input
                  id="spotify-url"
                  type="text"
                  placeholder="https://open.spotify.com/track/..."
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none text-gray-800 text-base"
                />
                <button
                  onClick={handleSpotify}
                  disabled={loading || !spotifyUrl}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base whitespace-nowrap shadow-lg hover:shadow-xl"
                >
                  {loading ? '⏳ Processing...' : '🚀 Transcribe'}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-600">
                Example: <code className="bg-white px-2 py-1 rounded font-mono text-green-600">https://open.spotify.com/episode/512ojhOuo1ktJpmZ5oJNxp</code>
              </p>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div id="upload-section" className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Upload Audio File
                </h2>
                <p className="text-sm text-gray-600">Transcribe MP3, WAV, or M4A files</p>
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4 text-sm text-indigo-800">
              <p className="font-semibold mb-3 text-base">📋 Supported Formats:</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white rounded-lg p-2 text-center">
                  <span className="font-bold text-indigo-600">MP3</span>
                  <p className="text-xs text-gray-600">audio/mpeg</p>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <span className="font-bold text-indigo-600">WAV</span>
                  <p className="text-xs text-gray-600">audio/wav</p>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <span className="font-bold text-indigo-600">M4A</span>
                  <p className="text-xs text-gray-600">audio/m4a</p>
                </div>
              </div>
              <p className="text-xs text-indigo-700">📏 Max file size: 100MB</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
              <p className="font-semibold mb-2">📁 Perfect for:</p>
              <ul className="space-y-1">
                <li>• Spotify episodes recorded with NoteBurner</li>
                <li>• Any pre-recorded audio files</li>
                <li>• Podcasts, meetings, voice notes</li>
              </ul>
            </div>

            {/* File Upload Section - Prominent */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                📁 Upload Your Audio File:
              </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mp3,audio/mpeg,audio/wav,audio/x-m4a,audio/m4a"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
              className="hidden"
            />
            <button
              onClick={handleFileSelect}
              disabled={loading}
              className="w-full bg-white border-2 border-blue-300 text-blue-700 py-4 px-6 rounded-lg font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base mb-3 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {fileName ? `📄 ${fileName}` : 'Choose Audio File'}
            </button>
            <button
              onClick={handleUpload}
              disabled={loading || !fileName}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl"
            >
              {loading ? '⏳ Transcribing...' : '🚀 Transcribe File'}
            </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 md:mt-8 bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="text-lg font-bold mb-1 text-red-800">Error</h2>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && result.transcript && (
          <div className="mt-6 md:mt-8 space-y-6">
            {/* Key Takeaways - Highlighted */}
            {result.takeaways && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl shadow-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-200 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">10 Key Takeaways</h2>
                    <p className="text-sm text-gray-600">Actionable insights for your workflows</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-inner">
                  <div className="prose prose-yellow max-w-none">
                    {(() => {
                      // Parse the takeaways and format each with a copy snippet
                      const lines = result.takeaways!.split('\n').filter(line => line.trim());
                      return lines.map((line, idx) => {
                        // Extract the learning (before implementation phrase)
                        const learningMatch = line.match(/\*\*(\d+)\.\s+\*\*(.+?)\s+\*\*/);
                        if (!learningMatch) return null;

                        const learning = learningMatch[2];
                        const standardSnippet = `Implement learnings of this point into structured prompt and apply`;

                        return (
                          <div key={idx} className="mb-6 pb-6 border-b-2 border-yellow-200 last:border-0">
                            <div className="bg-yellow-50 rounded-lg p-4 mb-3">
                              <h4 className="text-lg font-bold text-gray-800 mb-2">
                                #{idx + 1} {learning}
                              </h4>
                            </div>
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-800 font-mono">
                                <span className="font-bold">📋 Copy to Lovable:</span>
                                <span className="ml-2">{standardSnippet} {learning.toLowerCase()}</span>
                              </p>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-yellow-200">
                  <p className="text-sm text-yellow-800 flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <span><strong>Tip:</strong> Copy the blue snippet into Lovable to implement each learning.</span>
                  </p>
                </div>
              </div>
            )}

            {/* Stats Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{result.stats?.characters || result.transcript.length.toLocaleString()}</p>
                  <p className="text-sm text-blue-800 mt-1">Characters</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">{result.stats?.words || result.transcript.split(/\s+/).length.toLocaleString()}</p>
                  <p className="text-sm text-purple-800 mt-1">Words</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-green-600">{result.source === 'youtube-transcript-api' ? 'YouTube API' : 'AssemblyAI'}</p>
                  <p className="text-sm text-green-800 mt-1">Source</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-bold text-orange-600">{result.fallbackUsed ? '⚠️' : '✅'}</p>
                  <p className="text-sm text-orange-800 mt-1">Fallback Used</p>
                </div>
              </div>
            </div>

            {/* Full Transcript */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-gray-800">📝 Full Transcript</h2>
                  {result.filename && (
                    <p className="text-sm text-gray-500">Source: {result.filename}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
                  {result.duration && (
                    <span className="text-purple-600 font-medium text-sm">
                      ⏱️ {formatDuration(result.duration)}
                    </span>
                  )}
                </div>
              </div>

              {result.note && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  ℹ️ {result.note}
                </div>
              )}

              <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm md:text-base leading-relaxed">
                {result.transcript}
              </pre>

              {result.transcript && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>
                    📝 {result.stats?.words || result.transcript.split(/\s+/).length} words
                  </span>
                  <span>
                    📄 {result.stats?.characters || result.transcript.length} characters
                  </span>
                  {result.duration && (
                    <span>
                      📊 ~{Math.round((result.stats?.words || result.transcript.split(/\s+/).length) / (result.duration / 60))} words/min
                    </span>
                  )}
                  {result.size && (
                    <span>
                      💾 {formatFileSize(result.size)}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      const blob = new Blob([result.transcript!], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `transcript-${result.videoId || 'audio'}.txt`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
                  >
                    📥 Download
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </main>
    </>
  )
}

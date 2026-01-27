'use client'

import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'youtube' | 'spotify'>('youtube')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleYoutube = async () => {
    if (!youtubeUrl) return
    setLoading(true)
    setResult('')

    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl })
      })

      const data = await res.json()

      if (data.error) {
        setResult(`Error: ${data.error}`)
      } else if (data.transcript) {
        setResult(data.transcript)
      } else {
        setResult('No transcript found')
      }
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSpotify = async () => {
    if (!spotifyUrl) return
    setLoading(true)
    setResult('')

    try {
      const res = await fetch('/api/spotify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: spotifyUrl })
      })

      const data = await res.json()

      if (data.error) {
        setResult(`Error: ${data.error}`)
      } else {
        setResult(data.message || 'Processing complete')
      }
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Transcription App
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'youtube'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            YouTube Transcript
          </button>
          <button
            onClick={() => setActiveTab('spotify')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'spotify'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Spotify Download
          </button>
        </div>

        {/* YouTube Tab */}
        {activeTab === 'youtube' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Extract YouTube Transcript
            </h2>
            <input
              type="text"
              placeholder="Paste YouTube URL here..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none mb-4 text-gray-800"
            />
            <button
              onClick={handleYoutube}
              disabled={loading || !youtubeUrl}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Extracting...' : 'Extract Transcript'}
            </button>
          </div>
        )}

        {/* Spotify Tab */}
        {activeTab === 'spotify' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Download & Transcribe Spotify Audio
            </h2>
            <p className="text-gray-600 mb-4">
              Download audio from Spotify and get a text transcript.
            </p>
            <input
              type="text"
              placeholder="Paste Spotify track/playlist URL here..."
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none mb-4 text-gray-800"
            />
            <button
              onClick={handleSpotify}
              disabled={loading || !spotifyUrl}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Download & Transcribe'}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Result</h2>
            <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}

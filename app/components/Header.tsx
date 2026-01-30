'use client'

import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                Transcription App
              </h1>
              <p className="text-xs text-gray-600">YouTube • Spotify • Upload</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('youtube-section')}
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              YouTube
            </button>
            <button
              onClick={() => scrollToSection('spotify-section')}
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              Spotify
            </button>
            <button
              onClick={() => scrollToSection('upload-section')}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Upload
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <a
              href="/DOCS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              📚 Docs
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection('youtube-section')}
                className="text-left px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium text-gray-700 transition-colors"
              >
                📺 YouTube
              </button>
              <button
                onClick={() => scrollToSection('spotify-section')}
                className="text-left px-4 py-2 rounded-lg hover:bg-green-50 text-sm font-medium text-gray-700 transition-colors"
              >
                🎵 Spotify
              </button>
              <button
                onClick={() => scrollToSection('upload-section')}
                className="text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium text-gray-700 transition-colors"
              >
                📁 Upload File
              </button>
              <div className="h-px bg-gray-200 my-2"></div>
              <a
                href="/DOCS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
              >
                📚 Documentation
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

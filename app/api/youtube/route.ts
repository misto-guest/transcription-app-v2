import { NextRequest, NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'
import { AssemblyAI } from 'assemblyai'
import path from 'path'
import fs from 'fs'
import { glob } from 'glob'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Extract video ID
    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    // Get API key from environment
    const apiKey = process.env.ASSEMBLYAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AssemblyAI API key not configured. Please set ASSEMBLYAI_API_KEY environment variable.' },
        { status: 500 }
      )
    }

    // Initialize AssemblyAI
    const aai = new AssemblyAI({ apiKey })

    // Create temp directory in /tmp (Vercel serverless-compatible)
    const tempDir = path.join('/tmp', 'youtube', `${Date.now()}`)
    await fs.promises.mkdir(tempDir, { recursive: true, mode: 0o755 })

    // Output file path (use video ID as filename to avoid issues)
    const outputPath = path.join(tempDir, `${videoId}.mp3`)

    // Download audio using yt-dlp (using absolute paths, no chdir)
    const { spawn } = require('child_process')
    const downloadPromise = new Promise<void>((resolve, reject) => {
      const child = spawn('yt-dlp', [
        '-x',
        '--audio-format', 'mp3',
        '--output', outputPath,
        `https://www.youtube.com/watch?v=${videoId}`
      ], { stdio: 'pipe' })

      let stderr = ''
      child.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString()
      })

      child.on('close', (code: number | null) => {
        if (code && code !== 0 && stderr.includes('ERROR')) {
          reject(new Error(`yt-dlp failed: ${stderr}`))
        } else {
          resolve()
        }
      })
    })

    try {
      await downloadPromise
    } catch (downloadError: any) {
      // Fallback: try to get transcript directly via youtube-transcript if download fails
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId)
        const fullText = transcript.map((item: any) => item.text).join(' ').replace(/\s+/g, ' ').trim()
        return NextResponse.json({
          transcript: fullText,
          note: 'Used YouTube transcript (AssemblyAI audio download failed)'
        })
      } catch {
        return NextResponse.json(
          { error: `Failed to download audio: ${downloadError.message}` },
          { status: 500 }
        )
      }
    }

    // Check if file exists
    if (!fs.existsSync(outputPath)) {
      return NextResponse.json({ error: 'No audio file was downloaded' }, { status: 500 })
    }

    // Transcribe using AssemblyAI (SDK handles upload + transcription)
    let transcript
    try {
      transcript = await aai.transcripts.transcribe({ audio: outputPath })
    } catch (error: any) {
      // Clean up temp directory
      fs.rmSync(tempDir, { recursive: true, force: true })
      return NextResponse.json(
        { error: `Failed to transcribe: ${error.message}` },
        { status: 500 }
      )
    }

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true })

    if (!transcript.text) {
      return NextResponse.json({ error: 'No transcript generated' }, { status: 500 })
    }

    return NextResponse.json({
      transcript: transcript.text,
      filename: `${videoId}.mp3`,
      duration: transcript.audio_duration
    })
  } catch (error: any) {
    console.error('YouTube transcription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to transcribe video' },
      { status: 500 }
    )
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

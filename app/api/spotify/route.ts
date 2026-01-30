import { NextRequest, NextResponse } from 'next/server'
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

    // Create temp directory with absolute path
    const tempDir = path.join(process.cwd(), 'temp', 'spotify')
    await fs.promises.mkdir(tempDir, { recursive: true, mode: 0o755 })

    // Extract Spotify ID for filename
    const spotifyId = extractSpotifyId(url) || 'audio'
    const outputPath = path.join(tempDir, `${spotifyId}.mp3`)

    // Download audio using spotdl (using absolute paths)
    const { spawn } = require('child_process')
    const downloadPromise = new Promise<void>((resolve, reject) => {
      const child = spawn('spotdl', [
        url,
        '--output-format', 'mp3',
        '--output', outputPath
      ], { stdio: 'pipe' })

      let stderr = ''
      child.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString()
      })

      child.on('close', (code: number | null) => {
        if (code && code !== 0 && stderr.includes('Error')) {
          reject(new Error(`spotdl failed: ${stderr}`))
        } else {
          resolve()
        }
      })
    })

    try {
      await downloadPromise
    } catch (error: any) {
      return NextResponse.json(
        { error: `Failed to download Spotify audio: ${error.message}` },
        { status: 500 }
      )
    }

    // Check if file exists
    if (!fs.existsSync(outputPath)) {
      // Try to find any mp3 file in temp dir
      const files = await glob('*.mp3', { cwd: tempDir })
      if (files.length === 0) {
        return NextResponse.json({ error: 'No audio file was downloaded' }, { status: 500 })
      }
    }

    const audioPath = fs.existsSync(outputPath) ? outputPath : path.join(tempDir, (await glob('*.mp3', { cwd: tempDir }))[0])

    // Transcribe using AssemblyAI (SDK handles upload + transcription)
    let transcript
    try {
      transcript = await aai.transcripts.transcribe({ audio: audioPath })
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
      filename: path.basename(audioPath),
      duration: transcript.audio_duration
    })
  } catch (error: any) {
    console.error('Spotify transcription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}

function extractSpotifyId(url: string): string | null {
  const patterns = [
    /spotify\.com\/track\/([a-zA-Z0-9]+)/,
    /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
    /spotify\.com\/episode\/([a-zA-Z0-9]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

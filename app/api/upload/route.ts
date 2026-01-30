import { NextRequest, NextResponse } from 'next/server'
import { AssemblyAI } from 'assemblyai'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import { mkdir } from 'fs/promises'

export async function POST(req: NextRequest) {
  try {
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

    // Get form data
    const formData = await req.formData()
    const file = formData.get('audio') as File

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Please upload MP3, WAV, or M4A files.` },
        { status: 400 }
      )
    }

    // Check file size (AssemblyAI max is 5GB, but we'll limit to 100MB for reasonable uploads)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum is 100MB.` },
        { status: 400 }
      )
    }

    // Create temp directory
    const tempDir = path.join(process.cwd(), 'temp', 'uploads')
    await mkdir(tempDir, { recursive: true, mode: 0o755 })

    // Save uploaded file
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(tempDir, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    // Transcribe using AssemblyAI (SDK handles upload + transcription)
    let transcript
    try {
      transcript = await aai.transcripts.transcribe({ audio: filepath })
    } catch (error: any) {
      // Clean up temp file
      await unlink(filepath)
      return NextResponse.json(
        { error: `Failed to transcribe: ${error.message}` },
        { status: 500 }
      )
    }

    // Clean up temp file
    await unlink(filepath)

    if (!transcript.text) {
      return NextResponse.json({ error: 'No transcript generated' }, { status: 500 })
    }

    return NextResponse.json({
      transcript: transcript.text,
      filename: file.name,
      size: file.size,
      duration: transcript.audio_duration
    })
  } catch (error: any) {
    console.error('File upload transcription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}

// Support GET to check API status
export async function GET() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY
  return NextResponse.json({
    status: 'ready',
    configured: !!apiKey,
    message: apiKey ? 'AssemblyAI API is configured' : 'Please add ASSEMBLYAI_API_KEY to environment'
  })
}

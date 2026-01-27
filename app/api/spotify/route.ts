import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Extract Spotify track/playlist ID
    const spotifyId = extractSpotifyId(url)
    if (!spotifyId) {
      return NextResponse.json({ error: 'Invalid Spotify URL' }, { status: 400 })
    }

    // MVP: Return information about what would happen
    // In production, this would:
    // 1. Download audio using spotify-downloader or spotdl
    // 2. Transcribe using OpenAI Whisper API or local Whisper
    // 3. Return the transcript

    return NextResponse.json({
      message: 'Spotify download/transcription feature',
      spotifyId,
      note: 'This MVP shows the structure. Full implementation requires spotify-downloader + Whisper API or local Whisper installation.',
      steps: [
        '1. Download audio from Spotify (requires spotify-downloader/spotdl)',
        '2. Transcribe audio to text (requires OpenAI Whisper API or local Whisper)',
        '3. Return transcript'
      ]
    })
  } catch (error: any) {
    console.error('Spotify error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process Spotify URL' },
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

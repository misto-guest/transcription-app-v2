# Transcription App - AssemblyAI Version

A simple web app to extract transcripts from YouTube videos, download/transcribe Spotify audio, and upload any audio file for transcription using AssemblyAI.

## 📊 Status & History

**Status Page:** https://transcription-app-woad.vercel.app/status

The status page includes:
- **Live system status** - Runtime info, model, capabilities
- **Deployed apps** - Quick links to all production apps
- **Complete build history** - Automatic timeline of all commits, deployments, and milestones
- **Auto-refresh** - Updates every time you visit (data pulls from git, no manual updates needed)

History is **fully automatic** - every commit and deploy is tracked without manual maintenance.

## Features

### ✅ Working
- **YouTube Transcript Extraction** - Downloads audio and transcribes using AssemblyAI
- **Spotify Download & Transcription** - Downloads Spotify audio and transcribes
- **Audio File Upload** - Upload MP3/WAV/M4A files for transcription
- **Automated Spotify Recording** - CLI scripts to record DRM-protected episodes
- Clean, modern UI with Tailwind CSS
- Tab-based interface (3 tabs: YouTube, Spotify, Upload File)

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **AssemblyAI** (Speech-to-Text API)
- **youtube-dl-exec** (yt-dlp) for YouTube audio
- **spotdl** for Spotify audio
- **ffmpeg + BlackHole** (for automated Spotify recording)

## Quick Start

### Prerequisites

1. **yt-dlp** (for YouTube audio download):
   ```bash
   brew install yt-dlp
   ```

2. **AssemblyAI API Key** (free tier: 185 hours):
   - Go to https://www.assemblyai.com/
   - Sign up for free account
   - Get your API key from dashboard

3. **For Spotify (Optional Automated Recording)**:
   - Install ffmpeg: `brew install ffmpeg`
   - Download BlackHole: https://github.com/ExistentialAudio/BlackHole/releases
   - Install spotify-cli: `brew install spotify-cli` (optional, for auto-play)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your AssemblyAI API key
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Open http://localhost:3000 in your browser.

## Usage

### YouTube
1. Click "YouTube" tab
2. Paste YouTube URL
3. Click "Extract Transcript"
4. Wait for download + transcription (typically 10-30 seconds)

### Spotify
1. Click "Spotify" tab
2. Paste Spotify track URL
3. Click "Download & Transcribe"
4. Wait for download + transcription

### Upload File (For DRM-Protected Spotify & More)

**Use this for:**
- DRM-protected Spotify episodes (record first)
- Any pre-recorded audio (meetings, podcasts, voice notes)
- Files from other sources

**Steps:**
1. Click "Upload File" tab
2. Click "Choose Audio File"
3. Select MP3, WAV, or M4A file
4. Click "Transcribe File"
5. Wait for transcription (10-30 seconds)

---

## Automated Spotify Recording

### One-Time Setup

```bash
cd /Users/northsea/clawd-dmitry/transcription-app
chmod +x setup-spotify-recorder.sh spotify-recorder.sh
./setup-spotify-recorder.sh
```

This installs ffmpeg, spotify-cli, and guides you through BlackHole setup.

### Recording Episodes

**Automatic (recommended):**
```bash
./spotify-recorder.sh https://open.spotify.com/episode/47qumZrWcht3lN2DbP2Hs5 3600
```

**Manual:**
```bash
./spotify-recorder.sh 1800
```

Then upload the MP3 file via "Upload File" tab.

See `AUTOMATED_RECORDING.md` for full documentation.

## Cost

- **AssemblyAI**: $0.15 per hour (~$0.0025 per minute)
- **Free tier**: 185 hours included
- **Example**: One 20-minute video = $0.05

## Project Structure

```
transcription-app/
├── app/
│   ├── api/
│   │   ├── youtube/
│   │   │   └── route.ts    # YouTube API (yt-dlp + AssemblyAI)
│   │   ├── spotify/
│   │   │   └── route.ts    # Spotify API (spotdl + AssemblyAI)
│   │   └── upload/
│   │       └── route.ts    # File upload API (AssemblyAI)
│   ├── layout.tsx
│   ├── page.tsx            # Main UI (3 tabs)
│   └── globals.css
├── spotify-recorder.sh       # Automated Spotify recording script
├── setup-spotify-recorder.sh  # One-time setup script
├── AUTOMATED_RECORDING.md   # Full automation guide
├── SPOTIFY_DRM_GUIDE.md   # NoteBurner guide (manual option)
├── temp/                  # Temporary audio files (gitignored)
├── .env.local             # Your API key (gitignored)
└── .env.example           # Template for env vars
```

## Deployment to Vercel

### For production, you need:

1. **Environment variable**: Set `ASSEMBLYAI_API_KEY` in Vercel dashboard
2. **Serverless limitations**: Vercel serverless functions have:
   - 60-second timeout (may not work for very long videos)
   - 100MB request size limit
   - 4GB RAM limit

### Deploy:

```bash
npm run build
vercel
```

Or connect to GitHub and import your repository in Vercel.

**Note**: For production use with long videos, consider:
- Using a worker function for longer processing
- Storing audio in cloud storage (S3, etc.)
- Implementing queue processing

## Troubleshooting

### "yt-dlp not found"
Install yt-dlp: `brew install yt-dlp`

### "AssemblyAI API key not configured"
Add your API key to `.env.local` or Vercel environment variables

### "DRM protected" (Spotify)
Use "Upload File" tab after recording with NoteBurner (see `SPOTIFY_DRM_GUIDE.md`) or use automated recording scripts (see `AUTOMATED_RECORDING.md`)

### Timeout errors (long videos)
Serverless functions have 60-second timeout. For videos >5-10 minutes:
- Consider using Vercel Edge Functions
- Or implement background job processing

## License

MIT

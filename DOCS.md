# Transcription App Documentation

## 🎯 Overview

The Transcription App converts audio from **YouTube**, **Spotify**, or **uploaded files** into text transcripts using **AssemblyAI**.

---

## 🚀 Quick Start

### 1. YouTube Transcripts
1. Click the **YouTube** tab (or use the header navigation)
2. Paste any YouTube URL: `https://www.youtube.com/watch?v=AWxeTJp_lyk`
3. Click **🚀 Transcribe**
4. Wait for the transcript to appear

**Supported URL Formats:**
- `youtube.com/watch?v=VIDEO_ID`
- `youtu.be/VIDEO_ID`
- `youtube.com/embed/VIDEO_ID`
- Just the 11-character `VIDEO_ID`

### 2. Spotify Audio
1. Click the **Spotify** tab
2. Paste a Spotify URL (track, episode, or playlist)
3. Click **🚀 Transcribe**
4. Audio is downloaded, then transcribed

**⚠️ DRM Warning:** Some Spotify episodes are DRM-protected. If download fails:
- Use **NoteBurner Spotify Music Converter** to record the audio
- Upload the recorded file via the **Upload File** tab

### 3. Upload Audio Files
1. Click the **Upload File** tab
2. Click **Choose Audio File** or drag & drop
3. Select MP3, WAV, or M4A (max 100MB)
4. Click **🚀 Transcribe File**

---

## 📋 Supported Platforms & Formats

### YouTube
- ✅ Regular videos
- ✅ Shorts
- ✅ Most public content
- ❌ Age-restricted videos
- ❌ Private videos
- ❌ Live streams (unless VOD is available)

### Spotify
- ✅ Tracks
- ✅ Podcast episodes (non-DRM)
- ✅ Playlists (first track)
- ❌ DRM-protected episodes

### File Upload
| Format | MIME Type | Max Size |
|--------|-----------|----------|
| MP3    | audio/mpeg, audio/mp3 | 100MB |
| WAV    | audio/wav | 100MB |
| M4A    | audio/m4a, audio/x-m4a | 100MB |

---

## 🏗️ Architecture

### Provider: AssemblyAI
All transcription is handled by **AssemblyAI** — no OpenAI integration.

**Environment Variables:**
```bash
ASSEMBLYAI_API_KEY=your_api_key_here
```

### API Routes
```
POST /api/youtube    → Download YouTube audio + transcribe
POST /api/spotify    → Download Spotify audio + transcribe
POST /api/upload     → Upload file + transcribe
GET  /api/upload     → Check API status
```

---

## 🔧 Technical Details

### YouTube Transcription Flow
1. Extract video ID from URL
2. Download audio using `yt-dlp` (MP3 format)
3. Upload audio to AssemblyAI
4. Wait for transcription
5. Return transcript + metadata
6. Clean up temporary files

**Fallback:** If `yt-dlp` fails, the app tries to fetch YouTube's built-in transcript (if available).

### Spotify Transcription Flow
1. Extract Spotify ID from URL
2. Download audio using `spotdl` (MP3 format)
3. Upload to AssemblyAI
4. Transcribe + return result
5. Clean up temp files

### File Upload Flow
1. Validate file type (MP3/WAV/M4A)
2. Check file size (max 100MB)
3. Save to temp directory
4. Upload to AssemblyAI
5. Transcribe + return result
6. Delete temp file

---

## 🐛 Troubleshooting

### "AssemblyAI API key not configured"
**Cause:** Missing `ASSEMBLYAI_API_KEY` environment variable

**Fix:**
- **Vercel:** Add in Project Settings → Environment Variables
- **Local:** Add to `.env.local`

### "Failed to download audio"
**Cause (YouTube):** Video is private, age-restricted, or unavailable
**Fix:** Try a different video

**Cause (Spotify):** DRM-protected content
**Fix:** Use NoteBurner to record, then upload the file

### "No transcript generated"
**Cause:** Audio has no speech, or AssemblyAI failed
**Fix:** Try a different audio source

### Transcription timeout
**Cause:** Long audio files can take time
**Fix:** AssemblyAI supports up to 5GB files — just wait longer

---

## 📊 Output Format

Each transcript includes:

```json
{
  "transcript": "Full text transcript here...",
  "filename": "source.mp3",
  "duration": 180,        // seconds
  "size": 3670016         // bytes
}
```

**Displayed stats:**
- Word count
- Character count
- Words per minute
- File size
- Duration

---

## 🔒 Privacy & Security

- **No storage:** Transcripts are NOT saved permanently (no database)
- **Temp files:** Automatically deleted after processing
- **API key:** Never exposed to the client
- **AssemblyAI:** Processes audio on their servers (review their privacy policy)

---

## 🚀 Deployment

### Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add `ASSEMBLYAI_API_KEY` environment variable
4. Deploy

### Local Development
```bash
npm install
npm run dev
```

---

## 📝 Future Enhancements (Requested)

### Blackhole Tool (Transcript Storage)
**Status:** ❌ Not yet implemented

**Planned Features:**
- Save transcripts to a database
- Search saved transcripts
- Export to PDF, TXT, SRT
- Organize by tags/folders
- Share transcripts via URL

**Current Workaround:**
- Copy transcripts manually
- Save to local files
- Use browser bookmark to save transcript URLs

---

## 📚 API Reference

### POST /api/youtube
**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=AWxeTJp_lyk"
}
```

**Response:**
```json
{
  "transcript": "...",
  "filename": "AWxeTJp_lyk.mp3",
  "duration": 180
}
```

### POST /api/spotify
**Request:**
```json
{
  "url": "https://open.spotify.com/episode/512ojhOuo1ktJpmZ5oJNxp"
}
```

**Response:**
```json
{
  "transcript": "...",
  "filename": "512ojhOuo1ktJpmZ5oJNxp.mp3",
  "duration": 2400
}
```

### POST /api/upload
**Request:**
```
FormData: { audio: File }
```

**Response:**
```json
{
  "transcript": "...",
  "filename": "recording.mp3",
  "size": 3670016,
  "duration": 180
}
```

---

## 💡 Tips

- **YouTube:** Use short videos for faster results
- **Spotify:** Non-DRM content works best
- **Upload:** Compress audio first to stay under 100MB
- **Quality:** AssemblyAI handles background noise well
- **Languages:** Works best with English, supports 100+ languages

---

## 🆘 Support

- **GitHub Issues:** Report bugs or request features
- **AssemblyAI Docs:** https://www.assemblyai.com/docs
- **yt-dlp Docs:** https://github.com/yt-dlp/yt-dlp
- **spotdl Docs:** https://github.com/spotdl/spotify-downloader

---

**Version:** 2.0
**Last Updated:** 2026-01-30
**Powered by:** AssemblyAI

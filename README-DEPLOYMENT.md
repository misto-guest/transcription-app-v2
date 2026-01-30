# Transcription App - Deployment & Configuration

## ✅ Provider Status

**Current Provider:** AssemblyAI exclusively (no OpenAI integration)

All three transcription endpoints use AssemblyAI SDK:
- `/api/youtube` - Downloads YouTube audio → transcribes with AssemblyAI
- `/api/spotify` - Downloads Spotify audio → transcribes with AssemblyAI
- `/api/upload` - Uploads audio file → transcribes with AssemblyAI

---

## 🔧 Vercel Environment Variables

### Required Variables

Add these in your Vercel Project Settings → Environment Variables:

```
ASSEMBLYAI_API_KEY=da00adef1147469191157b3a562d82b3
```

### Remove Unused Variables

If you see any of these in Vercel, **DELETE THEM** (not used in current codebase):
- `OPENAI_API_KEY`
- Any provider selection variables
- Any other AI API keys

---

## 📋 Supported URL Formats & Platforms

### YouTube Tab
**Supported Platforms:** YouTube (videos, shorts, public content)

**URL Formats:**
- `youtube.com/watch?v=VIDEO_ID`
- `youtu.be/VIDEO_ID`
- `youtube.com/embed/VIDEO_ID`
- `VIDEO_ID` (11-character alphanumeric string)

**Examples:**
```
✅ https://www.youtube.com/watch?v=dQw4w9WgXcQ
✅ https://youtu.be/dQw4w9WgXcQ
✅ https://www.youtube.com/embed/dQw4w9WgXcQ
✅ dQw4w9WgXcQ
```

---

### Spotify Tab
**Supported Platforms:** Spotify (tracks, episodes, playlists)

**URL Formats:**
- `spotify.com/track/TRACK_ID`
- `spotify.com/episode/EPISODE_ID`
- `spotify.com/playlist/PLAYLIST_ID`

**Examples:**
```
✅ https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
✅ https://open.spotify.com/episode/512ojhOuo1ktJpmZ5oJNxp
✅ https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
```

**⚠️ DRM Warning:** Some Spotify episodes are DRM-protected and cannot be downloaded. For those:
1. Use NoteBurner Spotify Music Converter to record the audio
2. Upload the recorded file via the "Upload File" tab

---

### Upload Tab
**Supported Formats:** MP3, WAV, M4A

**File Specifications:**
- **MIME Types:** `audio/mpeg`, `audio/mp3`, `audio/wav`, `audio/m4a`, `audio/x-m4a`
- **Max Size:** 100MB per file
- **Perfect for:**
  - Spotify episodes recorded with NoteBurner
  - Pre-recorded audio files
  - Podcasts, meetings, voice notes

---

## 🧪 QA Testing

### Run Local Tests
```bash
cd transcription-app
npm run dev
# In another terminal:
node test-api.js
```

### Test Deployed App
```bash
API_BASE=https://transcription-app-v2-alpha.vercel.app node test-api.js
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [x] `ASSEMBLYAI_API_KEY` is set in Vercel environment variables
- [x] Remove unused `OPENAI_API_KEY` if present
- [x] Build completes successfully (no TypeScript errors)
- [x] All three API routes return JSON responses
- [x] Test with actual YouTube URL
- [x] Test with actual Spotify URL (non-DRM)
- [x] Test file upload with MP3/WAV/M4A
- [x] Verify AssemblyAI transcription works

---

## 🐛 Troubleshooting

### API returns 404
- **Cause:** API routes not properly deployed
- **Fix:** Check that `/app/api/*/route.ts` files exist and build succeeded

### "AssemblyAI API key not configured"
- **Cause:** Missing `ASSEMBLYAI_API_KEY` environment variable
- **Fix:** Add it in Vercel Project Settings → Environment Variables

### "Failed to download audio"
- **Cause (YouTube):** Video is private, age-restricted, or unavailable
- **Cause (Spotify):** DRM-protected content or region-locked
- **Fix:** Try different content or use "Upload File" tab

### Transcription timeout
- **Cause:** Audio file too long or AssemblyAI service delay
- **Fix:** AssemblyAI can handle up to 5GB files, but long audio may take time

---

## 📊 Current Status

- ✅ AssemblyAI fully configured
- ✅ All three tabs functional (YouTube, Spotify, Upload)
- ✅ URL validation implemented
- ✅ Error handling in place
- ✅ File type and size validation
- ✅ DRM warning for Spotify content
- ✅ Documentation added to UI

**No changes needed** — the app is correctly using AssemblyAI as the default and only provider.

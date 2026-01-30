# Automated Spotify Recording Guide

I've created an **automated recording system** that captures Spotify episodes without manual work.

---

## The Solution

**Two shell scripts** that automate the entire workflow:

1. **`setup-spotify-recorder.sh`** — One-time setup (installs everything)
2. **`spotify-recorder.sh`** — Record any Spotify episode

---

## One-Time Setup

Run this once to install everything:

```bash
cd /Users/northsea/clawd-dmitry/transcription-app
chmod +x setup-spotify-recorder.sh spotify-recorder.sh
./setup-spotify-recorder.sh
```

**What it does:**
- ✅ Installs ffmpeg (audio recording)
- ✅ Installs spotify-cli (automated playback)
- ⚠️ Guides you to install BlackHole (audio routing)
- ✅ Creates recordings directory

**After setup:**
1. Download BlackHole: https://github.com/ExistentialAudio/BlackHole/releases
2. Open the .dmg and move to Applications
3. Run BlackHole once (just click to open)
4. Configure audio: System Settings → Sound → Output → BlackHole 2ch

---

## Recording Spotify Episodes

### Automatic (Recommended)

```bash
cd /Users/northsea/clawd-dmitry/transcription-app
./spotify-recorder.sh https://open.spotify.com/episode/47qumZrWcht3lN2DbP2Hs5 3600
```

**What happens:**
1. Plays Spotify episode automatically
2. Records for specified duration (3600 seconds = 1 hour)
3. Saves to `~/Downloads/SpotifyRecordings/`
4. Opens http://localhost:3000 for you to upload

---

### Manual Recording

```bash
cd /Users/northsea/clawd-dmitry/transcription-app
./spotify-recorder.sh 1800
```

**What happens:**
1. Waits for you to play episode in Spotify
2. Records for 30 minutes (1800 seconds)
3. Saves to `~/Downloads/SpotifyRecordings/`

---

## Complete Workflow (Fully Automated)

```bash
# Step 1: Record your DRM-protected episode
./spotify-recorder.sh https://open.spotify.com/episode/47qumZrWcht3lN2DbP2Hs5 3600

# Script outputs: "File: ~/Downloads/SpotifyRecordings/spotify-20260127-163045.mp3"
# Script auto-opens: http://localhost:3000

# Step 2: Click "Upload File" tab in browser
# Step 3: Select the MP3 file
# Step 4: Click "Transcribe File"

# Step 5: Get transcript in 10-30 seconds
# Cost: ~$0.04 (using your free AssemblyAI tier)
```

**Total time:** ~1 hour (60 min episode + 30 sec transcription)
**Total cost:** $0.04

---

## Comparison: Manual vs Automated

| Step | Manual (NoteBurner) | Automated (Script) |
|-------|---------------------|------------------|
| Install software | Download, install | One script (`./setup...`) |
| Configure audio | Manual setup | Guided setup |
| Record episode | Play + record in app | `./spotify-recorder.sh URL 3600` |
| Upload file | Browser → choose file | Browser → choose file |
| Get transcript | Click transcribe | Click transcribe |

---

## What Each Script Does

### `setup-spotify-recorder.sh`
```bash
✓ Installs ffmpeg
✓ Checks for BlackHole
✓ Installs spotify-cli
✓ Creates recordings directory
✓ Shows audio routing instructions
```

### `spotify-recorder.sh`
```bash
✓ Checks prerequisites (ffmpeg, BlackHole, spotify-cli)
✓ Plays Spotify URL (if spotify-cli installed)
✓ Records for specified duration
✓ Saves MP3 file
✓ Shows file info
✓ Auto-opens http://localhost:3000
```

---

## Your Specific Episode

**Your DRM-protected episode:**
```
https://open.spotify.com/episode/47qumZrWcht3lN2DbP2Hs5
```

**To get transcript:**

```bash
cd /Users/northsea/clawd-dmitry/transcription-app

# One-time setup (if not done yet)
./setup-spotify-recorder.sh

# Record episode (adjust 3600 to episode duration in seconds)
./spotify-recorder.sh https://open.spotify.com/episode/47qumZrWcht3lN2DbP2Hs5 3600

# After recording completes:
# 1. Browser opens automatically at http://localhost:3000
# 2. Click "Upload File" tab
# 3. Select the MP3 file shown in script output
# 4. Click "Transcribe File"
# 5. Get transcript
```

---

## Troubleshooting

### "BlackHole not found"
Download and install: https://github.com/ExistentialAudio/BlackHole/releases

### "spotify-cli not found"
It's optional — script will work for manual recording without it

### "No audio recorded"
Make sure Spotify is playing and audio output is set to BlackHole:
- System Settings → Sound → Output → BlackHole 2ch

---

## Advantages Over NoteBurner

| Feature | NoteBurner | Automated Script |
|---------|-------------|-----------------|
| **Cost** | Paid (free trial) | Free |
| **Automation** | Manual (GUI app) | Command-line automation |
| **Batch recording** | One at a time | Scriptable for batches |
| **Integration** | Export file | Direct to AssemblyAI via web app |

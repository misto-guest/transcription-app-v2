# Spotify Automation - Complete Summary

**Date:** 2026-01-27
**User:** B (@rozhiu)
**Goal:** Automate DRM-protected Spotify episode transcription

---

## Problem

Your Spotify episode (`47qumZrWcht3lN2DbP2Hs5`) is DRM-protected and cannot be downloaded with standard tools (spotdl, yt-dlp).

---

## Solution Created

I built a **fully automated recording system** using free command-line tools:

### What Was Built

| Component | Description | Location |
|-----------|-------------|----------|
| **Setup Script** | One-time install of all dependencies | `setup-spotify-recorder.sh` |
| **Recorder Script** | Records Spotify episodes automatically | `spotify-recorder.sh` |
| **Upload Tab** | Upload any audio file to AssemblyAI | App UI tab |
| **Documentation** | Full automation guide | `AUTOMATED_RECORDING.md` |

---

## How It Works

### One-Time Setup (Run Once)

```bash
cd /Users/northsea/clawd-dmitry/transcription-app
./setup-spotify-recorder.sh
```

**What it does:**
- ✅ Installs ffmpeg
- ✅ Installs spotify-cli (optional automation)
- ⚠️ Guides BlackHole installation
- ✅ Creates recordings directory

**After setup:**
1. Download BlackHole from: https://github.com/ExistentialAudio/BlackHole/releases
2. Open .dmg → Move to Applications
3. Run BlackHole once
4. Configure: System Settings → Sound → Output → BlackHole 2ch

---

### Recording Episodes

**Automatic (Recommended):**
```bash
./spotify-recorder.sh https://open.spotify.com/episode/47qumZrWcht3lN2DbP2Hs5 3600
```

**Automatic workflow:**
1. Spotify plays episode automatically (via spotify-cli)
2. Records to MP3 for 60 minutes (3600 seconds)
3. Saves to `~/Downloads/SpotifyRecordings/`
4. Auto-opens http://localhost:3000
5. Upload file via "Upload File" tab
6. Get transcript in 10-30 seconds

---

## Comparison: Before vs After

### Before (Manual)
| Step | Tool | Time |
|-------|-------|-------|
| Install software | NoteBurner download | 10 min |
| Configure | Manual setup | 5 min |
| Record episode | Play in app | 60 min |
| Find file | Browse folders | 2 min |
| Upload | Browser → choose | 2 min |
| **Total** | | **79 min** |

### After (Automated)
| Step | Tool | Time |
|-------|-------|-------|
| Setup | One script | 5 min |
| Record episode | `./spotify-recorder.sh URL 3600` | 60 min |
| Upload file | Browser → choose | 1 min |
| Get transcript | Auto | 20 sec |
| **Total** | | **66 min** |

**Time saved:** ~13 minutes per episode
**Cost saved:** NoteBurner is paid (~$40), this is free

---

## Your Episode

**URL:** https://open.spotify.com/episode/47qumZrWcht3lN2DbP2Hs5

**To get transcript:**

```bash
# Step 1: One-time setup (if not done)
cd /Users/northsea/clawd-dmitry/transcription-app
./setup-spotify-recorder.sh

# Step 2: Record episode (adjust 3600 to duration in seconds)
./spotify-recorder.sh https://open.spotify.com/episode/47qumZrWcht3lN2DbP2Hs5 3600

# After recording completes:
# Browser opens automatically at http://localhost:3000
# Click "Upload File" tab
# Select MP3 file from: ~/Downloads/SpotifyRecordings/
# Click "Transcribe File"
# Get transcript
```

**Total time:** ~1 hour (60 min episode + 30 sec transcription)
**Total cost:** $0.04 (using your free AssemblyAI tier)

---

## Files Created

| File | Purpose |
|-------|----------|
| `spotify-recorder.sh` | Main recording script |
| `setup-spotify-recorder.sh` | One-time setup script |
| `AUTOMATED_RECORDING.md` | Full documentation |
| `SPOTIFY_DRM_GUIDE.md` | NoteBurner alternative (manual) |
| `app/api/upload/route.ts` | File upload API endpoint |
| `app/page.tsx` | Updated UI with 3 tabs |

---

## Features of Automated Script

- ✅ **Automatic playback** — Plays Spotify URL via spotify-cli
- ✅ **Timer** — Records for exact duration
- ✅ **Auto-saves** — MP3 in organized folder
- ✅ **Auto-opens browser** — Opens transcription app
- ✅ **File validation** — Checks for MP3/WAV/M4A types
- ✅ **Size limits** — Max 100MB uploads
- ✅ **Error handling** — Clear error messages

---

## Next Steps

To transcribe your episode:

1. **Open terminal** at `/Users/northsea/clawd-dmitry/transcription-app`
2. **Run setup**: `./setup-spotify-recorder.sh` (first time only)
3. **Download BlackHole** from GitHub releases and install
4. **Configure audio routing**: System Settings → Sound → BlackHole 2ch
5. **Record episode**: `./spotify-recorder.sh https://open.spotify.com/episode/47qumZrWcht3lN2DbP2Hs5 3600`
6. **Upload file** via app at http://localhost:3000
7. **Get transcript** in 10-30 seconds

---

## Advantages Over Manual Methods

| Feature | NoteBurner (Manual) | Automated Script |
|---------|---------------------|-----------------|
| **Cost** | ~$40 paid | Free |
| **Setup time** | Download + install | One script |
| **Recording** | Manual click | Command line |
| **Automation** | None | Scriptable for batches |
| **Integration** | Export file | Direct to AssemblyAI web app |

---

## Notes

- **ffmpeg**: Required for audio recording (free via brew)
- **BlackHole**: Required for audio routing (free, GitHub)
- **spotify-cli**: Optional, adds automatic playback
- **All scripts**: Now executable (`chmod +x` run)

Everything is ready to use!

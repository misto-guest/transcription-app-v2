#!/bin/bash

# Spotify Recorder for macOS
# Records Spotify audio using BlackHole (virtual audio device) + ffmpeg

set -e

# Configuration
RECORDING_DIR="${RECORDING_DIR:-$HOME/Downloads/SpotifyRecordings}"
DURATION="${DURATION:-1800}"  # Default: 30 minutes (in seconds)
AUDIO_DEVICE="BlackHole 2ch"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Spotify Recorder for macOS ===${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}✗ ffmpeg not found${NC}"
    echo "Install: brew install ffmpeg"
    exit 1
fi
echo -e "${GREEN}✓ ffmpeg installed${NC}"

# Check BlackHole
if ! system_profiler SPAudioDataType 2>/dev/null | grep -q "BlackHole" && \
   ! [ -d "/Applications/BlackHole.app" ] && ! [ -d "/Applications/BlackHole" ]; then
    echo -e "${RED}✗ BlackHole not found${NC}"
    echo ""
    echo "Please install BlackHole first:"
    echo "  1. Download from: https://github.com/ExistentialAudio/BlackHole/releases"
    echo "  2. Open .dmg file and drag BlackHole to Applications"
    echo "  3. Run BlackHole once"
    echo "  4. Configure: System Settings → Sound → Output → BlackHole 2ch"
    exit 1
fi
echo -e "${GREEN}✓ BlackHole installed${NC}"

# Check for spotify-cli or apify-cli
if command -v spotifycli &> /dev/null; then
    echo -e "${GREEN}✓ spotify-cli installed${NC}"
    HAS_SPOTIFY_CLI=spotifycli
elif command -v apify-cli &> /dev/null; then
    echo -e "${GREEN}✓ apify-cli installed${NC}"
    HAS_SPOTIFY_CLI=apify-cli
else
    echo -e "${YELLOW}⚠️ Spotify CLI not found (optional)${NC}"
    HAS_SPOTIFY_CLI=false
fi

echo ""
echo -e "${GREEN}All prerequisites met!${NC}"
echo ""

# Create recordings directory
mkdir -p "$RECORDING_DIR"

# List Spotify CLI commands if available
if [ -n "$HAS_SPOTIFY_CLI" ]; then
    echo -e "${YELLOW}Spotify CLI commands available:${NC}"
    echo "  $HAS_SPOTIFY_CLI play <url>     # Play specific URL"
    echo "  $HAS_SPOTIFY_CLI pause           # Pause playback"
    echo "  $HAS_SPOTIFY_CLI resume          # Resume playback"
    echo ""
fi

# Instructions
echo -e "${YELLOW}Recording Setup:${NC}"
echo "  1. Make sure Spotify is playing your target episode"
echo "  2. Audio output must be routed to 'BlackHole 2ch'"
echo "  3. Check: System Settings → Sound → Output → BlackHole 2ch"
echo ""
echo -e "${YELLOW}Usage:${NC}"
echo "  $0 <url> [duration_seconds]"
echo ""
echo "  <url>: Spotify URL (optional - required for spotifycli/apify-cli)"
echo "  [duration_seconds]: Recording duration (default: 1800 = 30 min)"
echo ""
echo -e "${YELLOW}Examples:${NC}"
echo "  $0                                              # Record for 30 min (manual play)"
echo "  $0 3600                                         # Record for 60 min (manual play)"
echo "  $0 https://open.spotify.com/episode/XXXXX 3600  # Play + record (if spotifycli available)"
echo ""

# Start recording
SPOTIFY_URL="$1"
if [ -n "$SPOTIFY_URL" ] && [ -n "$HAS_SPOTIFY_CLI" ]; then
    echo -e "${GREEN}Playing Spotify URL...${NC}"
    $HAS_SPOTIFY_CLI play "$SPOTIFY_URL" 2>/dev/null || true
    echo -e "${YELLOW}Waiting 5 seconds for Spotify to start...${NC}"
    sleep 5
fi

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
OUTPUT_FILE="$RECORDING_DIR/spotify-$TIMESTAMP.mp3"

echo -e "${GREEN}Starting recording...${NC}"
echo -e "  Duration: $DURATION seconds ($((DURATION / 60)) minutes"
echo -e "  Output: $OUTPUT_FILE"
echo -e "  Audio device: $AUDIO_DEVICE"
echo ""

# Record with ffmpeg
ffmpeg -f avfoundation \
    -i ":$AUDIO_DEVICE" \
    -t "$DURATION" \
    -c:a libmp3lame \
    -b:a 192k \
    -y \
    "$OUTPUT_FILE" 2>&1 | grep -v "Press \[q\] to stop"

# Check if recording was successful
if [ -f "$OUTPUT_FILE" ]; then
    FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo -e "${GREEN}✓ Recording complete!${NC}"
    echo -e "  File: $OUTPUT_FILE"
    echo -e "  Size: $FILE_SIZE"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "  1. Upload to: ${GREEN}http://localhost:3000${NC}"
    echo -e "  2. Click ${GREEN}'Upload File'${NC} tab"
    echo -e "  3. Select: $OUTPUT_FILE"
    echo -e "  4. Click ${GREEN}'Transcribe File'${NC}"

    # Open the transcription app
    open http://localhost:3000
else
    echo -e "${RED}✗ Recording failed${NC}"
    exit 1
fi

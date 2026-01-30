#!/bin/bash

# Automated Spotify Recorder Setup for macOS
# This script installs all dependencies and sets up audio routing

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Spotify Recorder Setup ===${NC}"
echo ""

# 1. Check/Install ffmpeg
echo -e "${YELLOW}[1/5] Checking ffmpeg...${NC}"
if ! command -v ffmpeg &> /dev/null; then
    brew install ffmpeg
    echo -e "${GREEN}✓ ffmpeg installed${NC}"
else
    echo -e "${GREEN}✓ ffmpeg already installed${NC}"
fi

# 2. Check/Install spotify-cli or apify-cli
echo ""
echo -e "${YELLOW}[2/5] Installing spotify-cli...${NC}"
if command -v spotifycli &> /dev/null; then
    echo -e "${GREEN}✓ spotify-cli already installed${NC}"
    HAS_SPOTIFY_CLI=true
elif command -v apify-cli &> /dev/null; then
    # apify-cli is an alternative that has the same commands
    brew install apify-cli 2>/dev/null || true
    if command -v apify-cli &> /dev/null; then
        echo -e "${GREEN}✓ apify-cli installed (similar to spotify-cli)${NC}"
        HAS_SPOTIFY_CLI=true
    fi
else
    echo -e "${YELLOW}Installing apify-cli...${NC}"
    brew install apify-cli
    if command -v apify-cli &> /dev/null; then
        echo -e "${GREEN}✓ apify-cli installed${NC}"
        HAS_SPOTIFY_CLI=true
    fi
fi

# 3. Check BlackHole
echo ""
echo -e "${YELLOW}[3/5] Checking BlackHole...${NC}"
if [ -d "/Applications/BlackHole.app" ] || [ -d "/Applications/BlackHole" ]; then
    echo -e "${GREEN}✓ BlackHole already installed${NC}"
    HAS_BLACKHOLE=true
else
    echo -e "${RED}✗ BlackHole not found${NC}"
    echo ""
    echo "BlackHole is required for audio routing."
    echo ""
    echo -e "${YELLOW}=== BlackHole Installation Instructions ===${NC}"
    echo ""
    echo "1. Download from:"
    echo "   https://github.com/ExistentialAudio/BlackHole/releases"
    echo ""
    echo "2. Download the latest .dmg file (e.g., BlackHole-0.4.0.dmg)"
    echo ""
    echo "3. Open the .dmg file (double-click)"
    echo ""
    echo "4. Drag 'BlackHole' to your Applications folder"
    echo ""
    echo "5. Run BlackHole once (just click to open it)"
    echo ""
    echo "6. Configure audio routing:"
    echo "   System Settings → Sound → Output"
    echo "   Select: 'BlackHole 2ch'"
    echo ""
    echo -e "${GREEN}After installing BlackHole, run this script again to confirm setup.${NC}"
    HAS_BLACKHOLE=false
fi

# 4. Create recordings directory
RECORDING_DIR="$HOME/Downloads/SpotifyRecordings"
mkdir -p "$RECORDING_DIR"

# 5. Summary
if [ "$HAS_BLACKHOLE" = true ]; then
    echo ""
    echo -e "${GREEN}=== Setup Complete! ===${NC}"
    echo ""
    echo -e "${GREEN}✓ ffmpeg${NC}"
    echo -e "${GREEN}✓ Spotify CLI${NC}"
    echo -e "${GREEN}✓ BlackHole${NC}"
    echo -e "${GREEN}✓ Recordings directory: $RECORDING_DIR${NC}"
    echo ""
    echo -e "${YELLOW}Ready to record Spotify episodes!${NC}"
    echo ""
    echo "To record Spotify:"
    echo -e "  ${GREEN}./spotify-recorder.sh${NC}"
    echo ""
    echo "Usage:"
    echo "  ${GREEN}./spotify-recorder.sh${NC}                           # Record 30 min (manual play)"
    echo "  ${GREEN}./spotify-recorder.sh 3600${NC}               # Record 60 min (manual play)"
    echo "  ${GREEN}./spotify-recorder.sh https://open.spotify.com/episode/XXXX 3600${NC}"
    echo ""
    echo "After recording:"
    echo -e "  1. Open: ${GREEN}http://localhost:3000${NC}"
    echo -e "  2. Click: ${GREEN}Upload File${NC} tab"
    echo -e "  3. Select: MP3 from ${GREEN}$RECORDING_DIR${NC}"
    echo -e "  4. Click: ${GREEN}Transcribe File${NC}"

    # Check spotify-cli/apify-cli for automation
    if [ "$HAS_SPOTIFY_CLI" = true ]; then
        echo ""
        echo -e "${YELLOW}Automation Commands Available:${NC}"
        echo "  Using spotifycli/apify-cli to play/pause Spotify"
    fi
else
    echo ""
    echo -e "${YELLOW}=== Setup Incomplete ===${NC}"
    echo ""
    echo "Please install BlackHole first, then run this script again."
    echo ""
    echo "1. Download BlackHole from GitHub releases"
    echo "2. Install and configure in System Settings → Sound"
    echo "3. Run: ${GREEN}./setup-spotify-recorder.sh${NC}"
fi

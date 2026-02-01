#!/bin/bash
# Automated YouTube Transcription Pipeline
# Combines transcript extraction with AssemblyAI enhancement

set -e

VIDEO_URL="$1"
OUTPUT_DIR="${2:-/tmp/transcripts}"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Extract video ID
VIDEO_ID=$(echo "$VIDEO_URL" | sed -n 's/.*\(v=\|youtu.be\/\)\([a-zA-Z0-9_-]\{11\}\).*/\2/p')

if [ -z "$VIDEO_ID" ]; then
    echo "❌ Could not extract video ID from URL"
    exit 1
fi

echo "📺 Video ID: $VIDEO_ID"
echo "⏳ Extracting YouTube transcript..."

# Extract transcript using Python script
PYTHON_SCRIPT="/Users/northsea/clawd-dmitry/transcription-app/scripts/youtube_transcript.py"
TRANSCRIPT_FILE="$OUTPUT_DIR/transcript_${VIDEO_ID}_$(date +%Y%m%d_%H%M%S).txt"

python3 "$PYTHON_SCRIPT" "$VIDEO_URL" -o "$TRANSCRIPT_FILE" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Transcript saved to: $TRANSCRIPT_FILE"
    echo "📊 Word count: $(wc -w < "$TRANSCRIPT_FILE")"
    echo "📊 Character count: $(wc -c < "$TRANSCRIPT_FILE")"

    # Optional: Enhance with AssemblyAI
    echo ""
    echo "💡 Would you like to enhance this transcript with AssemblyAI?"
    echo "   (Better formatting, speaker detection, punctuation)"
    echo ""
    echo "Run: curl -X POST http://localhost:3000/api/upload -F \"file=@$TRANSCRIPT_FILE\""
else
    echo "❌ Failed to extract transcript"
    exit 1
fi

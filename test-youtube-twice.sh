#!/bin/bash

# Test YouTube transcription twice
YOUTUBE_URL="https://www.youtube.com/watch?v=AWxeTJp_lyk"
API_URL="https://transcription-app-woad.vercel.app/api/youtube"

echo "========================================="
echo "Testing YouTube Transcription - Attempt 1"
echo "========================================="
echo "URL: $YOUTUBE_URL"
echo ""

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$YOUTUBE_URL\"}" \
  | jq .

echo ""
echo "Waiting 5 seconds before retry..."
echo ""
sleep 5

echo "========================================="
echo "Testing YouTube Transcription - Attempt 2"
echo "========================================="
echo "URL: $YOUTUBE_URL"
echo ""

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$YOUTUBE_URL\"}" \
  | jq .

echo ""
echo "========================================="
echo "YouTube testing complete"
echo "========================================="

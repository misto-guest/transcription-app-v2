#!/bin/bash

# Test Spotify transcription twice
SPOTIFY_URL="https://open.spotify.com/track/18RGqi2N6qGVueHQwfOB7m?si=817d5c7befc94413"
API_URL="https://transcription-app-woad.vercel.app/api/spotify"

echo "========================================="
echo "Testing Spotify Transcription - Attempt 1"
echo "========================================="
echo "URL: $SPOTIFY_URL"
echo ""

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$SPOTIFY_URL\"}" \
  | jq .

echo ""
echo "Waiting 5 seconds before retry..."
echo ""
sleep 5

echo "========================================="
echo "Testing Spotify Transcription - Attempt 2"
echo "========================================="
echo "URL: $SPOTIFY_URL"
echo ""

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$SPOTIFY_URL\"}" \
  | jq .

echo ""
echo "========================================="
echo "Spotify testing complete"
echo "========================================="

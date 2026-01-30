#!/bin/bash

# Railway Migration Script
# Migrate transcription app from Vercel to Railway for longer serverless timeouts

set -e

echo "🚀 Transcription App Migration: Vercel → Railway"
echo "============================================="
echo ""

# Change to project directory
cd ~/clawd-dmitry/transcription-app

echo "Step 1: Login to Railway"
echo "------------------------"
echo "Please run: railway login"
echo "This will open a browser for authentication"
echo ""
read -p "Press Enter after you've logged in..."

echo ""
echo "Step 2: Initialize Railway Project"
echo "-----------------------------------"
railway init

echo ""
echo "Step 3: Set Environment Variables"
echo "----------------------------------"
echo "Setting ASSEMBLYAI_API_KEY..."
railway variables set ASSEMBLYAI_API_KEY=da00adef1147469191157b3a562d82b3

echo ""
echo "Step 4: Deploy to Railway"
echo "-------------------------"
railway up

echo ""
echo "Step 5: Get Project URL"
echo "----------------------"
railway domain

echo ""
echo "✅ Migration Complete!"
echo ""
echo "Your app is now running on Railway with:"
echo "  - 15 minute serverless timeout (vs 60s on Vercel)"
echo "  - Full YouTube/Spotify transcription support"
echo "  - No more timeout errors"
echo ""
echo "Next steps:"
echo "  1. Test YouTube transcription"
echo "  2. Test Spotify transcription"
echo "  3. Update DNS/domain if needed"

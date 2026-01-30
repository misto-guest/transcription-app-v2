#!/bin/bash

# Auto-deploy script for Transcription App
# Usage: ./deploy.sh

echo "🚀 Deploying to Vercel (production)..."
echo ""

cd "$(dirname "$0")"

# Deploy with --yes to auto-confirm
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📦 Production URLs:"
echo "   Main: https://transcription-app-woad.vercel.app"
echo "   Alias: https://transcription-app-v2-alpha.vercel.app"

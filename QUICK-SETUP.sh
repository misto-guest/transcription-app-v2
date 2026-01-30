#!/bin/bash

# ONE-COMMAND SETUP - Copy and paste this entire block into your terminal

echo "🚀 Creating GitHub repo and setting up auto-deploy..."
echo ""

cd ~/clawd-dmitry/transcription-app

# Create repo and push
gh repo create misto-guest/transcription-app-v2 --public --source=. --remote=origin --push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Repository created and code pushed!"
    echo ""
    echo "📦 Repo URL: https://github.com/misto-guest/transcription-app-v2"
    echo ""
    echo "🎯 Next: Connect Vercel"
    echo "   1. Go to https://vercel.com/bram-1592s-projects/transcription-app/settings/git"
    echo "   2. Click 'Connect to Git'"
    echo "   3. Select 'transcription-app-v2' from your repos"
    echo "   4. Enable 'Deploy on Push' for 'main' branch"
    echo ""
    echo "🚀 After this, every git push will auto-deploy!"
else
    echo ""
    echo "❌ Something went wrong"
    echo ""
    echo "🔧 Manual setup:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Name: transcription-app-v2"
    echo "   3. Public"
    echo "   4. Don't initialize with README"
    echo "   5. Click 'Create repository'"
    echo "   6. Run in this folder:"
    echo "      git remote add origin https://github.com/misto-guest/transcription-app-v2.git"
    echo "      git push -u origin main"
fi

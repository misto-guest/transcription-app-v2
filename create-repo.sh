#!/bin/bash

# Quick GitHub repo creation using gh CLI with forced auth refresh
# This attempts to use existing browser auth

echo "🔐 Attempting to use GitHub CLI authentication..."
echo ""

cd "$(dirname "$0")"

# Try to get auth status
echo "📋 Checking GitHub auth status..."
gh auth status 2>&1

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ GitHub CLI not authenticated in this shell"
    echo ""
    echo "🔧 Quick fix - run this in YOUR terminal:"
    echo ""
    echo "   gh auth refresh"
    echo ""
    echo "   Then:"
    echo "   gh repo create misto-guest/transcription-app-v2 --public --source=. --remote=origin --push"
    echo ""
    echo "   Or give me the GitHub token from:"
    echo "   gh auth token"
    echo ""
    exit 1
fi

echo ""
echo "✅ Authenticated! Creating repo..."
gh repo create misto-guest/transcription-app-v2 --public --source=. --remote=origin --push

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! Repo created and code pushed!"
    echo ""
    echo "📦 GitHub URL: https://github.com/misto-guest/transcription-app-v2"
    echo ""
    echo "🔗 Next: Connect in Vercel for auto-deploy"
else
    echo ""
    echo "❌ Failed. Try manual creation:"
    echo "   https://github.com/new"
fi

#!/bin/bash

# Check GitHub repo creation status and provide next steps

echo "🔍 Checking repository status..."
echo ""

cd ~/clawd-dmitry/transcription-app

# Check if repo exists
gh repo view misto-guest/transcription-app-v2 &>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Repository exists!"
    echo ""
    gh repo view misto-guest/transcription-app-v2 --json name,url,visibility
    echo ""
    echo "📤 Pushing code..."
    git push -u origin main
else
    echo "❌ Repository not found on GitHub"
    echo ""
    echo "🔧 The repo creation command may have failed."
    echo ""
    echo "📋 Let's try again with this command:"
    echo ""
    echo "   gh repo create transcription-app-v2 --public --source=. --remote=origin --push"
    echo ""
    echo "   Note: Removed 'misto-guest/' prefix - it will use your default username"
    echo ""
    echo "   OR create manually at: https://github.com/new"
    echo "   Name: transcription-app-v2"
    echo "   Public: Yes"
    echo "   Then run: git remote set-url origin https://github.com/YOUR_USERNAME/transcription-app-v2.git"
    echo "            git push -u origin main"
fi

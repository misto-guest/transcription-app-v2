#!/bin/bash

# GitHub Repo Setup & Auto-Deploy Configuration
# Run this after creating the GitHub repo manually

echo "🔧 Setting up GitHub remote and auto-deploy..."
echo ""

cd "$(dirname "$0")"

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Git remote 'origin' already exists"
    echo "   Current: $(git remote get-url origin)"
    echo ""
    read -p "Update it? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted"
        exit 1
    fi
    git remote remove origin
fi

# Get GitHub URL
echo "📝 Enter your GitHub repository URL:"
echo "   Example: https://github.com/username/transcription-app-v2.git"
echo ""
read -p "GitHub URL: " GITHUB_URL

if [[ -z "$GITHUB_URL" ]]; then
    echo "❌ No URL provided"
    exit 1
fi

# Add remote
git remote add origin "$GITHUB_URL"
echo "✅ Added remote: origin → $GITHUB_URL"

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Go to https://vercel.com/dashboard"
    echo "   2. Open 'transcription-app' project"
    echo "   3. Settings → Git → Connect Repository"
    echo "   4. Select your GitHub repo"
    echo "   5. Enable 'Deploy on Push' for 'main' branch"
    echo ""
    echo "🚀 After setup, every git push will auto-deploy!"
else
    echo ""
    echo "❌ Push failed. Check your GitHub credentials."
fi

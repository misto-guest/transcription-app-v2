# 🚀 GitHub + Vercel Auto-Deploy Setup

## Current Status

✅ Environment variable configured in Vercel
✅ GitHub CLI authenticated (but not persisting in shell)

## Quick Setup (2 minutes)

### Option A: Create Repo & Give Me URL (Fastest)

1. **Create GitHub repo manually:**
   - Go to https://github.com/new
   - Name: `transcription-app-v2`
   - Make it Public
   - Don't initialize with README (we have code already)
   - Click "Create repository"

2. **Copy the repo URL** (example):
   ```
   https://github.com/YOUR_USERNAME/transcription-app-v2.git
   ```

3. **Tell me the URL** and I'll:
   - Add the remote
   - Push all code
   - Confirm Vercel auto-deploy is ready

### Option B: Fix GitHub CLI Auth

The authentication might not persist in the shell. Try:

```bash
# Set a persistent token
export GH_TOKEN=$(gh auth token)

# Then verify
gh auth status
```

Or run the interactive setup script:

```bash
cd transcription-app
./setup-github.sh
```

---

## What Auto-Deploy Will Look Like

Once GitHub is connected:

### I Make Changes:
```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

### Vercel Automatically:
1. Detects the push
2. Runs `npm run build`
3. Deploys to production
4. Updates the URLs

**Zero manual intervention!** 🎯

---

## Production URLs (Current)

- **Main:** https://transcription-app-woad.vercel.app
- **Alias:** https://transcription-app-v2-alpha.vercel.app

---

## Ready?

**Tell me your GitHub repo URL** and I'll complete the setup in seconds! 🚀

Or paste the output of:
```bash
gh auth status
```

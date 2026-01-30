# Auto-Deploy Setup

## Quick Deploy

To deploy the latest changes immediately:

```bash
./deploy.sh
```

Or manually:

```bash
vercel --prod --yes
```

## GitHub Auto-Deploy (Recommended)

For true auto-deploy on every git push, set up a GitHub repository:

### 1. Create GitHub Repo
```bash
# Initialize GitHub repo (if not already done)
gh repo create transcription-app --public --source=.
```

### 2. Add Remote
```bash
git remote add origin https://github.com/YOUR_USERNAME/transcription-app.git
git push -u origin main
```

### 3. Connect Vercel to GitHub
1. Go to https://vercel.com/dashboard
2. Select "transcription-app" project
3. Go to Settings → Git
4. Connect GitHub repository
5. Enable auto-deploy on push to `main` branch

### 4. Deploy Automatically
Now every time you push to GitHub, Vercel will auto-deploy:

```bash
git add .
git commit -m "Your message"
git push origin main
# ✅ Vercel deploys automatically!
```

## Current Deployment URLs

- **Main:** https://transcription-app-woad.vercel.app
- **Alias:** https://transcription-app-v2-alpha.vercel.app

## Environment Variables

Make sure these are set in Vercel Project Settings:

```
ASSEMBLYAI_API_KEY=da00adef1147469191157b3a562d82b3
```

## Build Status

Last deployment: ✅ Success (2026-01-30)

Build output:
- ✓ Compiled successfully
- ✓ All TypeScript errors fixed
- ✓ 7 pages generated
- ✓ API routes working

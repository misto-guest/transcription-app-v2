# 🚀 Railway Migration Guide

## Why Migrate?

**Vercel Limitations:**
- ❌ Serverless timeout: 60 seconds (Hobby plan)
- ❌ Transcription takes 2-5 minutes
- ❌ Functions killed mid-transcription

**Railway Benefits:**
- ✅ Serverless timeout: 15 minutes
- ✅ Full transcription support
- ✅ Free tier: $5 credit/month
- ✅ Simple deployment
- ✅ Auto-deploys from GitHub

---

## 🎯 Migration Steps

### Step 1: Install Railway CLI
```bash
# Already done ✓
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```
This opens a browser for authentication.

### Step 3: Initialize Project
```bash
cd ~/clawd-dmitry/transcription-app
railway init
```

Follow the prompts:
- Select "Create new project"
- Name: `transcription-app`
- Select region (default is fine)

### Step 4: Configure Environment Variables
```bash
railway variables set ASSEMBLYAI_API_KEY=da00adef1147469191157b3a562d82b3
```

### Step 5: Deploy
```bash
railway up
```

Railway will:
- Detect Next.js app
- Install dependencies
- Build the project
- Deploy to production
- Provide a public URL

### Step 6: Get Your URLs
```bash
railway domain
```

This shows your production URLs.

---

## 🔧 Optional: Connect GitHub for Auto-Deploy

In Railway dashboard:
1. Go to your project
2. Click "Settings" → "GitHub"
3. Connect `misto-guest/transcription-app-v2`
4. Enable "Deploy on Push"

Now every `git push` triggers automatic deployment! 🚀

---

## 📊 Comparison

| Feature | Vercel | Railway |
|---------|--------|---------|
| Timeout | 60s | 15min |
| Free Tier | Yes | $5/mo credit |
| Auto-Deploy | Yes | Yes |
| Build Time | ~30s | ~45s |
| Transcription | ❌ Times out | ✅ Works |

---

## ✅ After Migration

Test your URLs:
1. **YouTube:** https://www.youtube.com/watch?v=AWxeTJp_lyk
2. **Spotify:** https://open.spotify.com/track/18RGqi2N6qGVueHQwfOB7m

Both should work without timeouts! 🎉

---

## 🔄 Rollback (if needed)

If you want to keep Vercel as backup:
- Keep `transcription-app-woad.vercel.app` as backup
- Use Railway as primary for transcription
- Both can run simultaneously

---

**Ready to migrate?** Run the script:
```bash
~/clawd-dmitry/transcription-app/migrate-to-railway.sh
```

Or follow the manual steps above! 🚀

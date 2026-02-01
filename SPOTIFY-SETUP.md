# Quick Setup: Listen Notes API for Spotify

## Step 1: Get API Key (FREE)

1. **Go to:** https://listennotes.com/api
2. **Click:** "Get API Key" or "Sign Up"
3. **Sign up:** Use Google (saved Gmail)
4. **Copy:** Your free API key

**Free tier:** 50 requests/day (plenty for personal use)

## Step 2: Add to Vercel

```bash
npx vercel env add LISTENNOTES_API_KEY production
```

**Then paste your API key when prompted**

## Step 3: Redeploy

```bash
cd /Users/northsea/clawd-dmitry/transcription-app
npx vercel --prod
```

---

## Done! Spotify Support Activated ✅

**Works with:**
- Spotify episodes
- Spotify shows
- Any Spotify podcast URL

**Features:**
- Built-in transcripts (when available)
- Audio download + transcription (fallback)
- 10 key takeaways
- Lovable-ready snippets

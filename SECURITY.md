# Security Best Practices

## API Rate Limiting
```typescript
// Simple in-memory rate limiter
const rateLimit = new Map()

export async function rateLimit(ip: string, limit = 10, window = 60000) {
  const now = Date.now()
  const requests = rateLimit.get(ip) || []

  // Filter old requests
  const recent = requests.filter((time: number) => now - time < window)

  if (recent.length >= limit) {
    throw new Error('Too many requests')
  }

  recent.push(now)
  rateLimit.set(ip, recent)
}
```

## Input Validation
```typescript
// Validate YouTube URLs
function validateYouTubeURL(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
  ]
  return patterns.some(p => p.test(url))
}

// Validate Spotify URLs
function validateSpotifyURL(url: string): boolean {
  return /^https?:\/\/(open\.)?spotify\.com\/(track|episode|playlist)\//.test(url)
}
```

## File Type Validation (Already implemented)
```typescript
const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a']
const maxSize = 100 * 1024 * 1024 // 100MB
```

## CORS Configuration (Next.js handles this)
// next.config.js already configured properly

## Environment Variables (Already secure)
- ✅ Keys in .env.local
- ✅ .env.local in .gitignore
- ✅ Production keys in Vercel dashboard

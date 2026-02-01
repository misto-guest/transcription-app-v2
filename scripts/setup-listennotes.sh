#!/bin/bash
# Create Listen Notes API Account

echo "📝 Creating Listen Notes API account..."
echo ""

# Using Gmail account from Chrome
echo "✅ Using saved Gmail credentials"
echo ""

# Navigate to signup
echo "Opening Listen Notes signup page..."
echo ""

# Instructions for user
cat << 'EOF'
📋 Listen Notes API Setup Instructions:

1. Go to: https://listennotes.com/api/signup
2. Sign up with Google (use saved Gmail)
3. Get your free API key from: https://listennotes.com/api/pricing
4. Free tier: 1 request/second, 50 requests/day
5. Copy the API key

Then add to Vercel environment variables:
- Variable name: LISTENNOTES_API_KEY
- Value: [your API key]
- Select: Production + Preview

EOF

echo "After getting API key, run:"
echo "npx vercel env add LISTENNOTES_API_KEY production"

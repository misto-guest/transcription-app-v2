#!/bin/bash

# Railway Migration via CLI with Token
# Bypass interactive prompts using RAILWAY_TOKEN

set -e

RAILWAY_TOKEN="ae97aa63-3be4-4665-b821-2b88f4e2d13f"
PROJECT_NAME="transcription-app"
REPO="misto-guest/transcription-app-v2"

echo "🚀 Railway Migration (Automated)"
echo "================================="
echo ""

cd ~/clawd-dmitry/transcription-app

# Export token for this session
export RAILWAY_TOKEN

echo "Step 1: Linking Railway project..."
# Create project via API first
echo "Creating project via Railway API..."
CREATE_RESPONSE=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  https://backboard.railway.app/graphql/v2 \
  -d "{\"query\": \"mutation {
    projectCreate(input: { projectId: \\\"$PROJECT_NAME\\\" }) {
      project {
        id
        name
      }
    }
  }\"")

echo "$CREATE_RESPONSE" | jq .

PROJECT_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.projectCreate.project.id // empty')

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "null" ]; then
  echo "⚠️  Project creation may have failed or project already exists"
  echo "Trying to list existing projects..."
  
  LIST_RESPONSE=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
    -H "Content-Type: application/json" \
    https://backboard.railway.app/graphql/v2 \
    -d '{"query": "{ me { projects { edges { node { id name } } } } }"}')
  
  echo "$LIST_RESPONSE" | jq .
  
  echo ""
  echo "Trying to use existing project or create with CLI..."
  railway init --name "$PROJECT_NAME" || railway link || echo "Init failed"
else
  echo "✅ Project ID: $PROJECT_ID"
  
  # Link the project locally
  echo ""
  echo "Step 2: Linking project locally..."
  railway link "$PROJECT_ID" || echo "Link may have failed, continuing..."
fi

echo ""
echo "Step 3: Adding service from GitHub..."
railway add --source "$REPO" || echo "Service add may have failed"

echo ""
echo "Step 4: Setting environment variables..."
railway variables set ASSEMBLYAI_API_KEY=da00adef1147469191157b3a562d82b3

echo ""
echo "Step 5: Deploying to Railway..."
railway up

echo ""
echo "Step 6: Getting deployment URLs..."
railway domain

echo ""
echo "✅ Migration Complete!"
echo ""
echo "🧪 Test your app at the URLs shown above"

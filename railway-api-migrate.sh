#!/bin/bash

# Railway API-based Migration
# Uses GraphQL API instead of CLI for full automation

set -e

RAILWAY_TOKEN="ae97aa63-3be4-4665-b821-2b88f4e2d13f"
PROJECT_NAME="transcription-app"
SERVICE_NAME="web"

echo "🚀 Railway Migration via API"
echo "=============================="
echo ""

# Create project
echo "Step 1: Creating Railway project..."
PROJECT_RESPONSE=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  https://backboard.railway.app/graphql/v2 \
  -d "{
    \"query\": \"mutation {
      projectCreate(input: { projectId: \\\"$PROJECT_NAME\\\" }) {
        project {
          id
          name
        }
      }
    }\"
  }")

PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.data.projectCreate.project.id')
echo "✅ Project created: $PROJECT_ID"

# Get project ID
echo ""
echo "Step 2: Getting project details..."

# Create service (we'll use GitHub integration)
echo ""
echo "Step 3: Connecting GitHub repository..."
SERVICE_RESPONSE=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  https://backboard.railway.app/graphql/v2 \
  -d "{
    \"query\": \"mutation {
      serviceCreate(
        projectId: \\\"$PROJECT_ID\\\"
        input: {
          serviceName: \\\"$SERVICE_NAME\\\"
          source: {
            type: GITHUB
            repo: \\\"misto-guest/transcription-app-v2\\\"
            branch: \\\"main\\\"
          }
        }
      ) {
        service {
          id
          name
        }
      }
    }\"
  }")

SERVICE_ID=$(echo $SERVICE_RESPONSE | jq -r '.data.serviceCreate.service.id')
echo "✅ Service created: $SERVICE_ID"

# Set environment variables
echo ""
echo "Step 4: Setting environment variables..."
ENV_RESPONSE=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  https://backboard.railway.app/graphql/v2 \
  -d "{
    \"query\": \"mutation {
      variableUpsert(
        serviceId: \\\"$SERVICE_ID\\\"
        input: [
          { key: \\\"ASSEMBLYAI_API_KEY\\\", value: \\\"da00adef1147469191157b3a562d82b3\\\" }
        ]
      ) {
        variables {
          id
          key
        }
      }
    }\"
  }")
echo "✅ Environment variables set"

# Trigger deployment
echo ""
echo "Step 5: Triggering deployment..."
DEPLOY_RESPONSE=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  https://backboard.railway.app/graphql/v2 \
  -d "{
    \"query\": \"mutation {
      deployCreate(
        serviceId: \\\"$SERVICE_ID\\\"
        input: {}
      ) {
        deployment {
          id
          status
          url
        }
      }
    }\"
  }")

DEPLOY_ID=$(echo $DEPLOY_RESPONSE | jq -r '.data.deployCreate.deployment.id')
DEPLOY_URL=$(echo $DEPLOY_RESPONSE | jq -r '.data.deployCreate.deployment.url')
echo "✅ Deployment started: $DEPLOY_ID"

echo ""
echo "🎉 Migration Complete!"
echo "==================="
echo ""
echo "Project ID: $PROJECT_ID"
echo "Service ID: $SERVICE_ID"
echo "Deployment: $DEPLOY_ID"
echo ""
echo "🌐 Deployment URL:"
echo "   $DEPLOY_URL"
echo ""
echo "⏳ Deployment in progress... Check status at:"
echo "   https://railway.app/project/$PROJECT_ID"
echo ""
echo "🧪 Test your transcription URLs once deployed:"
echo "   YouTube: https://www.youtube.com/watch?v=AWxeTJp_lyk"
echo "   Spotify: https://open.spotify.com/track/18RGqi2N6qGVueHQwfOB7m"

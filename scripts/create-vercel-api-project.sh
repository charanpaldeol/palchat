#!/usr/bin/env bash
# Create the second Vercel project (API) for this repo.
# Requires: VERCEL_TOKEN (create at https://vercel.com/account/tokens)
# Optional: VERCEL_TEAM_ID (for teams)
#
# Usage: VERCEL_TOKEN=xxx [VERCEL_TEAM_ID=yyy] ./scripts/create-vercel-api-project.sh

set -e

if [ -z "$VERCEL_TOKEN" ]; then
  echo "Error: Set VERCEL_TOKEN (create at https://vercel.com/account/tokens)"
  exit 1
fi

# Repo from git remote (e.g. charanpaldeol/palchat)
if [ -z "$GIT_REPO_SLUG" ] && command -v git >/dev/null 2>&1; then
  REMOTE=$(git remote get-url origin 2>/dev/null || true)
  if [[ "$REMOTE" =~ github\.com[:/]([^/]+/[^/.]+) ]]; then
    GIT_REPO_SLUG="${BASH_REMATCH[1]%.git}"
  fi
fi
REPO_SLUG="${GIT_REPO_SLUG:-charanpaldeol/palchat}"
PROJECT_NAME="${VERCEL_API_PROJECT_NAME:-reclaim-api}"
ROOT_DIR="api"

TEAM_PARAM=""
if [ -n "$VERCEL_TEAM_ID" ]; then
  TEAM_PARAM="?teamId=$VERCEL_TEAM_ID"
fi

echo "Creating Vercel project: $PROJECT_NAME (root: $ROOT_DIR, repo: $REPO_SLUG)"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://api.vercel.com/v11/projects${TEAM_PARAM}" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$PROJECT_NAME\",
    \"rootDirectory\": \"$ROOT_DIR\",
    \"framework\": null,
    \"buildCommand\": \"npm run build\",
    \"gitRepository\": {
      \"type\": \"github\",
      \"repo\": \"$REPO_SLUG\"
    }
  }")

HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo "Project created successfully."
  echo "$HTTP_BODY" | jq -r '.link // .id // .'
  echo ""
  echo "Next steps:"
  echo "1. In Vercel dashboard, open the new project and add env vars: DATABASE_URL, ALLOWED_ORIGINS"
  echo "2. Update myastosite/vercel.json: set the rewrite destination to this project's URL (e.g. https://$PROJECT_NAME-xxx.vercel.app)"
  echo "3. In the frontend Vercel project, add env var API_URL with that same URL"
else
  echo "Request failed (HTTP $HTTP_CODE)"
  echo "$HTTP_BODY" | jq . 2>/dev/null || echo "$HTTP_BODY"
  exit 1
fi

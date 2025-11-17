#!/bin/bash

# Sync environment variables from .env.local to Vercel
# Usage: ./scripts/sync-env-to-vercel.sh [environment]
# Environment: production, preview, or development (default: production)

set -e

ENV_FILE=".env.local"
ENVIRONMENT="${1:-production}"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo "Error: Vercel CLI not found. Install it with: npm i -g vercel"
    exit 1
fi

echo "Syncing environment variables from $ENV_FILE to Vercel ($ENVIRONMENT environment)"
echo ""

# Parse .env.local file and add each variable to Vercel
while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
        continue
    fi
    
    # Extract key and value
    if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
        KEY="${BASH_REMATCH[1]}"
        VALUE="${BASH_REMATCH[2]}"
        
        # Remove quotes if present
        VALUE="${VALUE#\"}"
        VALUE="${VALUE%\"}"
        VALUE="${VALUE#\'}"
        VALUE="${VALUE%\'}"
        
        # Trim whitespace from key
        KEY=$(echo "$KEY" | xargs)
        
        if [ -z "$KEY" ]; then
            continue
        fi
        
        echo "Adding $KEY to Vercel..."
        echo "$VALUE" | vercel env add "$KEY" "$ENVIRONMENT"
        echo ""
    fi
done < "$ENV_FILE"

echo "Sync complete! Verify with: vercel env ls"

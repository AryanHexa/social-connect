#!/bin/bash

# Exit immediately if a command fails
set -e

# Check if commit message is provided
if [ -z "$1" ]; then
  echo "❌ Error: Commit message required."
  echo "Usage: ./deploy.sh \"Your commit message\""
  exit 1
fi

MESSAGE="$1"

echo "🚀 Running build..."
npm run build

echo "📦 Adding changes..."
git add --all

echo "📝 Committing changes with message: $MESSAGE"
git commit -m "$MESSAGE"

echo "⬆️ Pushing to origin main..."
git push -u origin main

echo "✅ Done!"

#!/bin/bash

# Exit immediately if a command fails
set -e

SKIP_BUILD=false

# Parse flags
while getopts "b" opt; do
  case $opt in
    b)
      SKIP_BUILD=true
      ;;
    *)
      ;;
  esac
done

# Shift processed options so $1 becomes the commit message
shift $((OPTIND -1))

# Check if commit message is provided
if [ -z "$1" ]; then
  echo "❌ Error: Commit message required."
  echo "Usage: ./deploy.sh [-b] \"Your commit message\""
  exit 1
fi

MESSAGE="$1"

# Run build unless -b flag was passed
if [ "$SKIP_BUILD" = false ]; then
  echo "🚀 Running build..."
  npm run build
else
  echo "⏭️ Skipping build (flag -b used)"
fi

echo "📦 Adding changes..."
git add --all

echo "📝 Committing changes with message: $MESSAGE"
git commit -m "$MESSAGE"

echo "⬆️ Pushing to origin main..."
git push -u origin main

echo "✅ Done!"

#!/bin/bash
# Quick Git Push Script - Push only changed files

echo "🚀 Starting Git Push..."
echo "================================"

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ Error: Not a git repository!"
    exit 1
fi

# Check git status
echo "📊 Checking changed files..."
git status --short

# Count changed files
CHANGED_FILES=$(git status --short | wc -l)

if [ $CHANGED_FILES -eq 0 ]; then
    echo "✅ No changes to commit!"
    exit 0
fi

echo ""
echo "📝 Found $CHANGED_FILES changed file(s)"
echo ""

# Add only modified and new files (not deleted)
echo "➕ Adding changed files..."
git add -u  # Add modified files
git add .   # Add new files

# Show what will be committed
echo ""
echo "📋 Files to be committed:"
git diff --cached --name-status

# Commit with auto-generated message
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MSG="🔄 Auto-commit: Updated files - $TIMESTAMP"

echo ""
echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

# Push to remote
echo ""
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Repository: https://github.com/OmkArsoni72/HackBios-AgriFintech.git"
else
    echo ""
    echo "❌ Push failed! Please check your connection and credentials."
    exit 1
fi

echo "================================"
echo "✨ Done!"

#!/bin/bash

# Simple deployment script for GitHub Pages

# Exit on any error
set -e

echo "Starting deployment process..."

# Check if we're on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    echo "Warning: You are not on the main or master branch"
fi

# Add all files
git add .

# Commit changes
echo "Enter commit message (or press enter for default message):"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="Deploy updates"
fi

git commit -m "$commit_message"

# Push to remote repository
echo "Pushing to remote repository..."
git push origin HEAD

echo "Deployment completed!"
echo "Don't forget to configure GitHub Pages in your repository settings:"
echo "1. Go to your repository Settings"
echo "2. Scroll to 'Pages' section"
echo "3. Select 'Deploy from a branch'"
echo "4. Choose your branch and /root folder"
echo "5. Click Save"
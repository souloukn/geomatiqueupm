#!/bin/bash

# ========================================
# GEOMATIQUE UPM - DEPLOYMENT SCRIPT
# ========================================

# Simple deployment script for GitHub Pages

# Exit on any error
set -e

echo "========================================"
echo "GEOMATIQUE UPM - DEPLOYMENT SCRIPT"
echo "========================================"
echo

echo "Starting deployment process..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: This directory is not a git repository"
    exit 1
fi

# Check current branch
current_branch=$(git branch --show-current)
echo "Current branch: $current_branch"

if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    echo "Warning: You are not on the main or master branch"
    echo "GitHub Pages deployment typically uses main or master branch"
    echo
fi

# Add all files
echo "Adding all files to git..."
git add .

# Check if there are changes to commit
if ! git diff-index --quiet HEAD --; then
    # There are changes to commit
    echo
    echo "Enter commit message (or press enter for default message):"
    read commit_message

    if [ -z "$commit_message" ]; then
        commit_message="Deploy updates $(date)"
    fi

    echo "Committing changes..."
    git commit -m "$commit_message"
    
    # Push to remote repository
    echo
    echo "Pushing to remote repository..."
    git push origin HEAD
    
    echo
    echo "Deployment completed!"
else
    echo "No changes to commit."
    echo
    echo "Do you want to push anyway? (y/N):"
    read push_anyway
    
    if [[ "$push_anyway" =~ ^[Yy]$ ]]; then
        echo "Pushing to remote repository..."
        git push origin HEAD
        echo "Push completed."
    else
        echo "Skipping push."
    fi
fi

echo
echo "========================================"
echo "NEXT STEPS FOR GITHUB PAGES DEPLOYMENT:"
echo "========================================"
echo "1. Go to your repository on GitHub"
echo "2. Click on Settings tab"
echo "3. Scroll down to Pages section"
echo "4. Under Source, select:"
echo "   - Branch: $current_branch"
echo "   - Folder: / (root)"
echo "5. Click Save"
echo
echo "It may take a few minutes for your site to be published."
echo "Your site will be available at:"
echo "https://souloukn.github.io/geomatiqueupm/"
echo
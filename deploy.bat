@echo off
title Deployment Script

echo Starting deployment process...

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo Error: This directory is not a git repository
    pause
    exit /b 1
)

REM Add all files
echo Adding all files to git...
git add .

REM Commit changes
echo.
set /p commit_message=Enter commit message (or press Enter for default message): 
if "%commit_message%"=="" set commit_message=Deploy updates

echo Committing changes...
git commit -m "%commit_message%"

REM Push to remote repository
echo.
echo Pushing to remote repository...
git push origin HEAD

echo.
echo Deployment completed!
echo.
echo Don't forget to configure GitHub Pages in your repository settings:
echo 1. Go to your repository Settings
echo 2. Scroll to 'Pages' section
echo 3. Select 'Deploy from a branch'
echo 4. Choose your branch and /root folder
echo 5. Click Save
echo.
pause
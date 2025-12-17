@echo off
title Deployment Script

echo ========================================
echo GEOMATIQUE UPM - DEPLOYMENT SCRIPT
echo ========================================
echo.

echo Starting deployment process...

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo Error: This directory is not a git repository
    pause
    exit /b 1
)

REM Check current branch
for /f %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i

echo Current branch: %CURRENT_BRANCH%

if not "%CURRENT_BRANCH%"=="main" if not "%CURRENT_BRANCH%"=="master" (
    echo Warning: You are not on the main or master branch
    echo GitHub Pages deployment typically uses main or master branch
    echo.
)

REM Add all files
echo Adding all files to git...
git add .

REM Check if there are changes to commit
git diff-index --quiet HEAD --
if errorlevel 1 (
    REM There are changes to commit
    echo.
    set /p commit_message=Enter commit message (or press Enter for default message): 
    if "%commit_message%"=="" set commit_message=Deploy updates %date% %time%
    
    echo Committing changes...
    git commit -m "%commit_message%"
    
    REM Push to remote repository
    echo.
    echo Pushing to remote repository...
    git push origin HEAD
    
    echo.
    echo Deployment completed!
) else (
    echo No changes to commit.
    echo.
    set /p push_anyway=Do you want to push anyway? (y/N): 
    if /i "%push_anyway%"=="y" (
        echo Pushing to remote repository...
        git push origin HEAD
        echo Push completed.
    ) else (
        echo Skipping push.
    )
)

echo.
echo ========================================
echo NEXT STEPS FOR GITHUB PAGES DEPLOYMENT:
echo ========================================
echo 1. Go to your repository on GitHub
echo 2. Click on Settings tab
echo 3. Scroll down to Pages section
echo 4. Under Source, select:
echo    - Branch: %CURRENT_BRANCH%
echo    - Folder: / (root)
echo 5. Click Save
echo.
echo It may take a few minutes for your site to be published.
echo Your site will be available at:
echo https://souloukn.github.io/geomatiqueupm/
echo.
pause
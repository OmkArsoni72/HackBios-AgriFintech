@echo off
REM Quick Git Push Script for Windows - Push only changed files

echo.
echo ========================================
echo 🚀 Starting Git Push...
echo ========================================
echo.

REM Check if we're in a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Not a git repository!
    pause
    exit /b 1
)

REM Check git status
echo 📊 Checking changed files...
git status --short

REM Add all changed files
echo.
echo ➕ Adding changed files...
git add -A

REM Show what will be committed
echo.
echo 📋 Files to be committed:
git diff --cached --name-status

REM Check if there are changes to commit
git diff --cached --quiet
if errorlevel 1 (
    REM There are changes to commit
    
    REM Commit with timestamp
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
    for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)
    
    echo.
    echo 💾 Committing changes...
    git commit -m "🔄 Auto-commit: Updated files - %mydate% %mytime%"
    
    REM Push to remote
    echo.
    echo 📤 Pushing to GitHub...
    git push origin main
    
    if errorlevel 1 (
        echo.
        echo ❌ Push failed! Please check your connection and credentials.
        pause
        exit /b 1
    ) else (
        echo.
        echo ✅ Successfully pushed to GitHub!
        echo 🌐 Repository: https://github.com/OmkArsoni72/HackBios-AgriFintech.git
    )
) else (
    echo.
    echo ✅ No changes to commit!
)

echo.
echo ========================================
echo ✨ Done!
echo ========================================
echo.
pause

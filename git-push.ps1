# Quick Git Push Script for PowerShell
# Push only changed files to GitHub

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 Starting Git Push..." -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if we're in a git repository
try {
    git rev-parse --is-inside-work-tree 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Not a git repository"
    }
}
catch {
    Write-Host "❌ Error: Not a git repository!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check git status
Write-Host "📊 Checking changed files..." -ForegroundColor Yellow
git status --short

# Count changed files
$changedFiles = (git status --short | Measure-Object).Count

if ($changedFiles -eq 0) {
    Write-Host "`n✅ No changes to commit!" -ForegroundColor Green
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host "`n📝 Found $changedFiles changed file(s)`n" -ForegroundColor Cyan

# Add all changed files
Write-Host "➕ Adding changed files..." -ForegroundColor Yellow
git add -A

# Show what will be committed
Write-Host "`n📋 Files to be committed:" -ForegroundColor Yellow
git diff --cached --name-status

# Create commit message with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMsg = "🔄 Auto-commit: Updated files - $timestamp"

Write-Host "`n💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMsg

# Push to remote
Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🌐 Repository: https://github.com/OmkArsoni72/HackBios-AgriFintech.git" -ForegroundColor Cyan
}
else {
    Write-Host "`n❌ Push failed! Please check your connection and credentials." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✨ Done!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Read-Host "Press Enter to exit"

Set-Location $PSScriptRoot

Write-Host "=== AUTO SYNC START ==="

git add .

$changes = git status --porcelain

if (-not $changes) {
    Write-Host "No local changes. Nothing to sync."
    exit 0
}

$time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

git commit -m "Auto sync $time"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Commit failed. Stop sync."
    exit 1
}

Write-Host "Pulling latest changes..."

git pull --rebase origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Pull/rebase failed. Possible conflict. Stop before push."
    exit 1
}

Write-Host "Pushing to GitHub..."

git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed."
    exit 1
}

Write-Host "=== SYNC COMPLETED ==="
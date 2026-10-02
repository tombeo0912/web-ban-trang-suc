Set-Location $PSScriptRoot

git add .

$changes = git status --porcelain

if ($changes) {
    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    git commit -m "Auto sync $time"

    git pull --rebase origin main

    git push origin main
}
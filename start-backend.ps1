Write-Host "Starting ShindaPesa Backend Server..." -ForegroundColor Blue
Write-Host ""

# Change to backend directory
Set-Location -Path "backend"
Write-Host "Backend Directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

Write-Host "Starting server on port 3000..." -ForegroundColor Cyan
node index.js

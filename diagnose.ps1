# ShindaPesa App Diagnostic Script
Write-Host "=== ShindaPesa App Diagnostic ===" -ForegroundColor Blue
Write-Host ""

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
node --version

# Check npm version
Write-Host "Checking npm version..." -ForegroundColor Yellow
npm --version

# Check React Native CLI
Write-Host "Checking React Native CLI..." -ForegroundColor Yellow
try {
    npx react-native --version
} catch {
    Write-Host "React Native CLI not found!" -ForegroundColor Red
}

# Check if main dependencies are installed
Write-Host ""
Write-Host "Checking main dependencies..." -ForegroundColor Yellow
Write-Host "react-native-flash-message:" -NoNewline
try {
    $result = npm ls react-native-flash-message 2>$null
    if ($LASTEXITCODE -eq 0) {
    Write-Host " ✓ Installed" -ForegroundColor Blue
    } else {
        Write-Host " ✗ Missing" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ Error checking" -ForegroundColor Red
}

# Check TypeScript compilation
Write-Host ""
Write-Host "Checking TypeScript compilation..." -ForegroundColor Yellow
try {
    npx tsc --noEmit
    Write-Host "TypeScript: ✓ No compilation errors" -ForegroundColor Blue
} catch {
    Write-Host "TypeScript: ✗ Compilation errors found" -ForegroundColor Red
}

# Check backend dependencies
Write-Host ""
Write-Host "Checking backend..." -ForegroundColor Yellow
if (Test-Path "backend/package.json") {
    Write-Host "Backend package.json: ✓ Found" -ForegroundColor Blue
    Set-Location backend
    try {
        $backendDeps = npm ls express 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Backend dependencies: ✓ Installed" -ForegroundColor Blue
        } else {
            Write-Host "Backend dependencies: ✗ Missing" -ForegroundColor Red
        }
    } catch {
        Write-Host "Backend dependencies: ✗ Error checking" -ForegroundColor Red
    }
    Set-Location ..
} else {
    Write-Host "Backend: ✗ package.json not found" -ForegroundColor Red
}

# Check Android setup
Write-Host ""
Write-Host "Checking Android setup..." -ForegroundColor Yellow
try {
    npx react-native doctor 2>$null | Select-String "Android"
} catch {
    Write-Host "Android setup: Unable to check (run 'npx react-native doctor' manually)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Diagnostic Complete ===" -ForegroundColor Blue
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. If TypeScript errors: Fix compilation issues first" -ForegroundColor White
Write-Host "2. If dependencies missing: Run 'npm install'" -ForegroundColor White
Write-Host "3. If Android issues: Install Android Studio and SDK" -ForegroundColor White
Write-Host "4. To start app: Run './start-app.ps1' or './start-app.bat'" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"

0# 🚀 Complete Build Script for Frame Splitter v1.0.0
# This script will build and package your application

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FRAME SPLITTER - BUILD SCRIPT v1.0.0" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean previous builds
Write-Host "🧹 STEP 1: Cleaning previous builds..." -ForegroundColor Yellow
Write-Host "   Removing dist/ folder..." -ForegroundColor White
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   Removing dist-react/ folder..." -ForegroundColor White
Remove-Item -Path "dist-react" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   ✓ Cleanup complete`n" -ForegroundColor Green

# Step 2: Check if icon exists
Write-Host "🎬 STEP 2: Checking icon..." -ForegroundColor Cyan
if (Test-Path "build\icon.ico") {
    Write-Host "   ✓ Icon found: build\icon.ico" -ForegroundColor Green
    $iconSize = (Get-Item "build\icon.ico").Length / 1KB
    Write-Host "   Icon size: $([math]::Round($iconSize, 2)) KB`n" -ForegroundColor White
} else {
    Write-Host "   ⚠️  Icon not found in build\" -ForegroundColor Yellow
    Write-Host "   Using default icon...`n" -ForegroundColor White
}

# Step 3: Build React app
Write-Host "⚛️  STEP 3: Building React application..." -ForegroundColor Cyan
Write-Host "   Running: npm run build:react" -ForegroundColor White
npm run build:react

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ React build successful`n" -ForegroundColor Green
} else {
    Write-Host "   ❌ React build failed!" -ForegroundColor Red
    Write-Host "   Please fix errors and try again`n" -ForegroundColor White
    exit 1
}

# Step 4: Build Windows application
Write-Host "🏗️  STEP 4: Building Windows application..." -ForegroundColor Green
Write-Host "   This may take 5-10 minutes..." -ForegroundColor White
Write-Host "   Running: npm run build:win`n" -ForegroundColor White
npm run build:win

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n   ✓ Windows build successful!`n" -ForegroundColor Green
} else {
    Write-Host "`n   ❌ Windows build failed!" -ForegroundColor Red
    Write-Host "   Please check errors above`n" -ForegroundColor White
    exit 1
}

# Step 5: Show results
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "          BUILD COMPLETE! ✅" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Build Output:" -ForegroundColor Yellow
if (Test-Path "dist") {
    $exeFiles = Get-ChildItem "dist" -Filter "*.exe" -ErrorAction SilentlyContinue
    if ($exeFiles) {
        foreach ($file in $exeFiles) {
            $sizeMB = [math]::Round($file.Length / 1MB, 2)
            Write-Host "   ✓ $($file.Name)" -ForegroundColor Green
            Write-Host "     Size: $sizeMB MB" -ForegroundColor White
            Write-Host "     Path: $($file.FullName)" -ForegroundColor Gray
            Write-Host ""
        }
    } else {
        Write-Host "   ⚠️  No .exe files found in dist/" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  dist/ folder not found" -ForegroundColor Yellow
}

# Step 6: Next steps
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "          NEXT STEPS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Testing:" -ForegroundColor Cyan
Write-Host "   1. Go to dist/ folder" -ForegroundColor White
Write-Host "   2. Run: Frame Splitter Setup 1.0.0.exe" -ForegroundColor Yellow
Write-Host "   3. Install and test the application" -ForegroundColor White
Write-Host ""
Write-Host "🚀 GitHub Release:" -ForegroundColor Cyan
Write-Host "   1. Go to: https://github.com/kaif11ali/Frame-Splitter/releases" -ForegroundColor White
Write-Host "   2. Create new release with tag: v1.0.0" -ForegroundColor Yellow
Write-Host "   3. Upload both .exe files from dist/" -ForegroundColor White
Write-Host "   4. Copy description from: RELEASE-NOTES-v1.0.0.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "   - Release notes: RELEASE-NOTES-v1.0.0.md" -ForegroundColor White
Write-Host "   - Pre-release checklist: PRE-RELEASE-CHECKLIST.md" -ForegroundColor White
Write-Host "   - Project structure: PROJECT-STRUCTURE.md" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Calculate checksums
Write-Host "🔐 Generating checksums..." -ForegroundColor Cyan
if (Test-Path "dist") {
    $exeFiles = Get-ChildItem "dist" -Filter "*.exe" -ErrorAction SilentlyContinue
    if ($exeFiles) {
        foreach ($file in $exeFiles) {
            $hash = Get-FileHash $file.FullName -Algorithm SHA256
            Write-Host "   $($file.Name)" -ForegroundColor Yellow
            Write-Host "   SHA256: $($hash.Hash)`n" -ForegroundColor Gray
        }
    }
}

Write-Host "✅ Build script completed successfully!`n" -ForegroundColor Green
Write-Host "🎉 Frame Splitter v1.0.0 is ready for release!`n" -ForegroundColor Cyan

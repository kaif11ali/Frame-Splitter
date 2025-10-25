# 🧪 Quick Test Script - Frame Splitter
# Test the application before building

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   FRAME SPLITTER - QUICK TEST" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version
Write-Host "   ✓ Node.js: $nodeVersion`n" -ForegroundColor Green

# Check dependencies
Write-Host "📚 Checking dependencies..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "   ✓ node_modules found" -ForegroundColor Green
    
    # Check critical packages
    $packages = @("electron", "react", "ffmpeg-static", "sharp", "png-to-ico")
    foreach ($pkg in $packages) {
        if (Test-Path "node_modules\$pkg") {
            Write-Host "   ✓ $pkg installed" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $pkg NOT found" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ❌ node_modules not found!" -ForegroundColor Red
    Write-Host "   Run: npm install`n" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check files
Write-Host "📁 Checking project files..." -ForegroundColor Cyan
$requiredFiles = @(
    "package.json",
    "main-electron.js",
    "preload.js",
    "VideoToFramesConverter.js",
    "cli.js",
    "index.js",
    "vite.config.js"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file MISSING!" -ForegroundColor Red
    }
}

Write-Host ""

# Check icon
Write-Host "🎬 Checking icon..." -ForegroundColor Cyan
if (Test-Path "build\icon.ico") {
    $iconSize = (Get-Item "build\icon.ico").Length / 1KB
    Write-Host "   ✓ Icon found: build\icon.ico ($([math]::Round($iconSize, 2)) KB)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Icon not found in build\" -ForegroundColor Yellow
    Write-Host "   Run: node update-icon.mjs" -ForegroundColor White
}

Write-Host ""

# Check src files
Write-Host "⚛️  Checking React source..." -ForegroundColor Cyan
if (Test-Path "src") {
    $reactFiles = @("src\App.jsx", "src\index.jsx", "src\components")
    foreach ($file in $reactFiles) {
        if (Test-Path $file) {
            Write-Host "   ✓ $file" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $file MISSING!" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ❌ src/ folder not found!" -ForegroundColor Red
}

Write-Host ""

# Check documentation
Write-Host "📖 Checking documentation..." -ForegroundColor Cyan
$docs = @("README.md", "LICENSE", "RELEASE-NOTES-v1.0.0.md")
foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "   ✓ $doc" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $doc not found" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "          TEST COMPLETE" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "🚀 Ready to build?" -ForegroundColor Yellow
Write-Host "   Run: .\build-release.ps1`n" -ForegroundColor White

Write-Host "🧪 Want to test in dev mode?" -ForegroundColor Yellow
Write-Host "   Run: npm run electron:dev`n" -ForegroundColor White

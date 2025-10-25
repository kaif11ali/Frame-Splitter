# 🚀 Quick Start Guide - Frame Splitter v1.0.0 Release

## ⚡ 3-Step Release Process

### Step 1: Update Icon (Optional but Recommended) 🎬
```powershell
# Save your movie reel image as: movie-reel-logo.png
# Then run:
node update-icon.mjs
```
**Result:** Creates `icon.ico` and `build/icon.ico` with your movie reel logo

---

### Step 2: Build Application 🏗️
```powershell
.\build-release.ps1
```
**Result:** Creates installer in `dist/` folder (~5-10 minutes)

---

### Step 3: Test & Release 📦
```powershell
# Test installation
cd dist
.\Frame Splitter Setup 1.0.0.exe

# Create GitHub Release
# Upload .exe files from dist/
# Copy description from RELEASE-NOTES-v1.0.0.md
```

---

## 🎯 One-Line Quick Build

```powershell
node update-icon.mjs ; npm run build:react ; npm run build:win
```

---

## 📋 Files You'll Get

After building, you'll find in `dist/`:
- ✅ **Frame Splitter Setup 1.0.0.exe** (~150-200 MB) - Installer
- ✅ **Frame Splitter 1.0.0.exe** (~200-250 MB) - Portable

---

## 🧪 Test Before Building

```powershell
# Quick system check
.\test-before-build.ps1

# Test in development mode
npm run electron:dev
```

---

## 📖 Documentation Reference

| File | Use For |
|------|---------|
| `RELEASE-NOTES-v1.0.0.md` | GitHub release description |
| `PRE-RELEASE-CHECKLIST.md` | Complete release checklist |
| `ICON-UPDATE-GUIDE.md` | Detailed icon instructions |
| `PROJECT-STRUCTURE.md` | Understanding project layout |
| `README.md` | User-facing documentation |

---

## 🐛 Common Issues & Solutions

### ❌ "Cannot find module"
```powershell
npm install
```

### ❌ "Icon not found"
```powershell
node update-icon.mjs
```

### ❌ "Build failed"
```powershell
# Clean and rebuild
Remove-Item dist, dist-react -Recurse -Force
npm run build:react
npm run build:win
```

### ❌ "Icon doesn't show after install"
- Uninstall old version
- Delete desktop shortcuts
- Rebuild with new icon
- Install fresh

---

## 🎬 Icon Update - Super Quick

```powershell
# Save movie reel as: movie-reel-logo.png
node update-icon.mjs
npm run build:win
```
Done! 🎉

---

## 📊 What's Changed

| Before | After |
|--------|-------|
| 30+ root files | 15 clean files |
| Old icon | 🎬 Movie reel icon |
| v1.0.2 internal | v1.0.0 official |
| No release notes | Complete documentation |
| "Your Name" | Kaif Ali (KF) |

---

## 🔗 GitHub Release Steps

1. Go to: https://github.com/kaif11ali/Frame-Splitter/releases
2. Click **"Create a new release"**
3. **Tag**: `v1.0.0`
4. **Title**: `Frame Splitter v1.0.0 - Official Release`
5. **Description**: Copy from `RELEASE-NOTES-v1.0.0.md`
6. **Upload**: Both .exe files from `dist/`
7. **Check**: ✅ Set as the latest release
8. Click **"Publish release"**

---

## ✅ Pre-Flight Checklist

- [ ] Icon updated (movie reel logo)
- [ ] Tested in dev mode
- [ ] Built successfully
- [ ] Tested installation
- [ ] Tested frame extraction
- [ ] Ready to release on GitHub

---

## 💡 Pro Tips

**Speed up builds:**
- SSD is faster than HDD
- Close other apps
- Disable antivirus temporarily during build

**Better testing:**
- Test on clean Windows install (VM)
- Test different video formats
- Test different video sizes
- Get feedback from 2-3 people

**GitHub release:**
- Use screenshots in description
- Add video demo (optional)
- Include system requirements
- Add SHA256 checksums for security

---

## 🎉 You're Ready!

Everything is prepared. Just follow the 3 steps:

1. 🎬 Update icon
2. 🏗️ Build app  
3. 📦 Release on GitHub

**Good luck with your release!** 🚀

---

**Version:** 1.0.0  
**Date:** October 25, 2025  
**Developer:** Kaif Ali (KF)  
**Status:** ✅ Ready to build and release

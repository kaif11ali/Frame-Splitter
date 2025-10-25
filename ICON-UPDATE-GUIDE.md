# 🎬 Update Desktop Icon - Movie Reel Logo

## 📋 Quick Guide

Follow these simple steps to update your Frame Splitter desktop icon with the movie reel logo.

---

## 🎯 Step 1: Save the Movie Reel Image

1. **Right-click** on the movie reel image (the one you showed me)
2. **Save As** → Name it: `movie-reel-logo.png`
3. **Save it in**: `c:\Users\kf\OneDrive\Documents\Github-open-source-projects\Frame-Splitter\`

**Alternative names accepted:**
- `movie-reel-logo.png` (recommended)
- `frame-splitter-logo.png`
- `logo.png`

---

## 🔧 Step 2: Run the Icon Converter

Open PowerShell in the project folder and run:

```powershell
node update-icon.mjs
```

This will:
- ✅ Convert PNG to ICO format
- ✅ Create multiple icon sizes (16x16 to 256x256)
- ✅ Save to `icon.ico` (project root)
- ✅ Save to `build/icon.ico` (for electron-builder)

---

## 🏗️ Step 3: Rebuild the Application

```powershell
npm run build:win
```

This creates:
- `Frame Splitter Setup 1.0.2.exe` (installer)
- `Frame Splitter 1.0.2.exe` (portable)

Both will use the new movie reel icon! 🎬

---

## 📦 Step 4: Install and Test

1. Go to the `dist/` folder
2. Run `Frame Splitter Setup 1.0.2.exe`
3. Install the application
4. Check your desktop shortcut - it should show the movie reel icon! 🎉

---

## 🎨 What the Script Does

```javascript
// Converts your PNG to ICO with multiple sizes
16x16   → For taskbar and small icons
32x32   → For file explorer
48x48   → For desktop shortcuts
64x64   → For large icons view
128x128 → For high-DPI displays
256x256 → For maximum quality
```

---

## 📁 Files That Will Be Updated

| File | Location | Purpose |
|------|----------|---------|
| `icon.ico` | Project root | Main icon file |
| `build/icon.ico` | Build folder | Used by electron-builder |

---

## ⚙️ How Electron Uses the Icon

The icon is configured in `package.json`:

```json
"build": {
  "appId": "com.kaifali.framesplitter",
  "productName": "Frame Splitter",
  "win": {
    "icon": "build/icon.ico"
  }
}
```

When you run `npm run build:win`, electron-builder:
1. Reads `build/icon.ico`
2. Embeds it into the .exe file
3. Creates desktop shortcuts with the icon
4. Uses it for the installer

---

## 🔍 Troubleshooting

### ❌ Error: "png-to-ico not found"
**Solution:**
```powershell
npm install png-to-ico sharp --save-dev
```

### ❌ Error: "Logo image not found"
**Solution:**
- Make sure the image is saved as `movie-reel-logo.png`
- Check it's in the correct folder
- Try using the full path

### ❌ Icon doesn't update after installation
**Solution:**
1. Uninstall the old version
2. Delete desktop shortcuts
3. Rebuild: `npm run build:win`
4. Install fresh

### ❌ Icon looks blurry
**Solution:**
- Make sure your source PNG is at least 256x256 pixels
- Save it as PNG (not JPG)
- Use transparent background for best results

---

## 🎨 Icon Design Tips

For the best desktop icon:

✅ **DO:**
- Use 256x256 px or larger source image
- Use PNG format with transparent background
- Keep design simple and recognizable
- Test on both light and dark backgrounds
- Use high contrast colors

❌ **DON'T:**
- Use JPG (no transparency support)
- Use very small images (<128px)
- Include too much detail (won't show at small sizes)
- Use very light colors (hard to see)

---

## 📊 Current vs New Icon

| Before | After |
|--------|-------|
| Generic/Old icon | 🎬 Movie Reel Logo |
| Low resolution | High resolution (256x256) |
| Single size | Multiple sizes (16-256px) |

---

## 🚀 Complete Workflow

```powershell
# 1. Save the movie reel image
# (Right-click → Save As → movie-reel-logo.png)

# 2. Convert to ICO
node update-icon.mjs

# 3. Rebuild the app
npm run build:win

# 4. Install and enjoy!
cd dist
./Frame Splitter Setup 1.0.2.exe
```

---

## 📝 Quick Command Reference

```powershell
# Convert icon
node update-icon.mjs

# Build for Windows
npm run build:win

# Build for all platforms
npm run build:all

# Run in dev mode (to preview icon)
npm run electron
```

---

## 🎯 Expected Output

When you run `node update-icon.mjs`, you should see:

```
🎬 Updating Frame Splitter Icon...

✓ Found logo: movie-reel-logo.png
📐 Creating icon in multiple sizes...
   ✓ Created 16x16
   ✓ Created 32x32
   ✓ Created 48x48
   ✓ Created 64x64
   ✓ Created 128x128
   ✓ Created 256x256

🔄 Converting to ICO format...
   ✓ Created icon.ico
   ✓ Created build/ directory
   ✓ Created build/icon.ico

🧹 Cleaning up temporary files...
   ✓ Cleaned up

✅ Icon updated successfully!

📍 Icon files created:
   - icon.ico (project root)
   - build/icon.ico (for electron-builder)

📋 Next steps:
   1. npm run build:win
   2. Install the new Setup.exe
   3. Your desktop icon will show the movie reel! 🎬
```

---

## 🎬 Final Result

After installation, your Frame Splitter app will have:
- 🎬 Movie reel icon on desktop
- 🎬 Movie reel icon in Start Menu
- 🎬 Movie reel icon in taskbar
- 🎬 Movie reel icon in file explorer
- 🎬 Movie reel icon in the app window

**Perfect branding for your video frame extraction tool!** ✨

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message
2. Verify the PNG file exists
3. Ensure sharp and png-to-ico are installed
4. Try rebuilding from scratch

---

**Created:** October 25, 2025  
**Updated for:** Frame Splitter v1.0.0  
**Icon:** Movie Reel Logo 🎬

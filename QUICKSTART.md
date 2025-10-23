# Quick Start Guide - React + Electron Frame Splitter

## 🚀 Getting Started

### First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run in Development Mode**
   ```bash
   npm run electron:dev
   ```
   
   This will:
   - Start the Vite dev server (React)
   - Launch Electron window
   - Enable hot-reload for development

### Alternative: Run Components Separately

If you want to run the dev server and Electron separately:

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2** (after dev server is running):
```bash
npm run electron
```

## 📦 Building for Production

### Build Windows Installer

```bash
npm run build:win
```

The installer will be created in the `dist/` folder.

### Build for All Platforms (Mac, Windows, Linux)

```bash
npm run build:all
```

## 🎯 How to Use the App

1. **Select Video**: Drag & drop a video file or click "Select Video File"
2. **Choose Output Folder**: Click "Select Output Folder" to choose where frames will be saved
3. **Configure Settings**:
   - **Auto Mode**: Extracts 1 frame per second
   - **Custom Mode**: Specify exact number of frames
   - **Custom Frame Rate**: Override video's frame rate (optional)
4. **Convert**: Click "Convert Images" button
5. **Check Output**: Frames will be saved as numbered PNG files

## 🛠️ Development Tips

### Hot Reload
- Changes to React components will hot-reload automatically
- Changes to Electron main process require app restart

### Debugging
- React DevTools: Available in development mode
- Electron DevTools: Opens automatically in development mode

### Project Structure
```
src/
  ├── App.jsx              # Main app component
  ├── components/          # React components
  │   ├── DropZone.jsx    # Video file selector
  │   ├── FileInfo.jsx    # Video info display
  │   ├── Controls.jsx    # Conversion controls
  │   ├── ProgressBar.jsx # Progress indicator
  │   └── StatusMessage.jsx # Status messages
  └── App.css             # Styling
```

## 🐛 Troubleshooting

### Port Already in Use
If you see "Port 5173 is already in use":
```bash
# Kill the process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Blank Electron Window
- Ensure Vite dev server is running first
- Check browser console for errors (F12 in Electron)
- Try: `npm run electron:dev` instead

### FFmpeg Not Found
- FFmpeg is bundled automatically
- If issues persist, check that `node_modules` has `ffmpeg-static` and `ffprobe-static`

## 📝 NPM Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server only |
| `npm run build:react` | Build React app for production |
| `npm run electron` | Run Electron (development mode) |
| `npm run electron:dev` | Run full dev environment |
| `npm run electron:build` | Build React and run Electron |
| `npm run build:win` | Build Windows installer |
| `npm run build:all` | Build for all platforms |

## ✨ Features

- ✅ Modern React 18 UI
- ✅ Native Electron desktop app
- ✅ Drag & drop support
- ✅ Real-time progress tracking
- ✅ Auto and custom frame extraction modes
- ✅ Custom frame rate support
- ✅ High-quality PNG output
- ✅ Cross-platform (Windows, Mac, Linux)

## 🎨 Customization

### Change Theme Colors
Edit `src/App.css` and modify the color variables:
- Primary color: `#A5755E`
- Background: `#E8DCC8`
- Success color: `#4CAF50`

### Modify Window Size
Edit `main-electron.js`:
```javascript
width: 900,  // Change this
height: 700, // Change this
```

---

Made with ❤️ by KAIFALI

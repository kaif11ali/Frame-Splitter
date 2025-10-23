# Frame Splitter Architecture

## Application Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ELECTRON MAIN PROCESS                    │
│                    (main-electron.js)                        │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • Window Management                                │     │
│  │  • IPC Handlers                                     │     │
│  │  • File System Operations                          │     │
│  │  • VideoToFramesConverter Integration              │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────┘
                           │ IPC Communication
                           │ (via preload.js)
┌──────────────────────────┴──────────────────────────────────┐
│                  ELECTRON RENDERER PROCESS                   │
│                     (React Application)                      │
│  ┌────────────────────────────────────────────────────┐     │
│  │                    App.jsx                          │     │
│  │  • Global State Management                         │     │
│  │  • IPC Communication                               │     │
│  │  • Component Coordination                          │     │
│  └──────────────┬─────────────────────────────────────┘     │
│                 │                                            │
│  ┌──────────────┴──────────────────────────────────┐        │
│  │              React Components                    │        │
│  │  ┌────────────────────────────────────────┐     │        │
│  │  │  DropZone.jsx                          │     │        │
│  │  │  • Drag & drop interface               │     │        │
│  │  │  • File selection                      │     │        │
│  │  └────────────────────────────────────────┘     │        │
│  │  ┌────────────────────────────────────────┐     │        │
│  │  │  FileInfo.jsx                          │     │        │
│  │  │  • Video metadata display              │     │        │
│  │  │  • File information                    │     │        │
│  │  └────────────────────────────────────────┘     │        │
│  │  ┌────────────────────────────────────────┐     │        │
│  │  │  Controls.jsx                          │     │        │
│  │  │  • Frame extraction settings           │     │        │
│  │  │  • Output folder selection             │     │        │
│  │  │  • Conversion trigger                  │     │        │
│  │  └────────────────────────────────────────┘     │        │
│  │  ┌────────────────────────────────────────┐     │        │
│  │  │  ProgressBar.jsx                       │     │        │
│  │  │  • Real-time progress tracking         │     │        │
│  │  │  • Visual progress indicator           │     │        │
│  │  └────────────────────────────────────────┘     │        │
│  │  ┌────────────────────────────────────────┐     │        │
│  │  │  StatusMessage.jsx                     │     │        │
│  │  │  • Success/error/info messages         │     │        │
│  │  │  • Auto-dismiss notifications          │     │        │
│  │  └────────────────────────────────────────┘     │        │
│  └─────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      BUILD SYSTEM (Vite)                      │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Development Server (Port 5173)                    │     │
│  │  • Hot Module Replacement (HMR)                    │     │
│  │  • Fast refresh                                    │     │
│  │  • Live reload                                     │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Production Build                                  │     │
│  │  • Optimized bundles                               │     │
│  │  • Code splitting                                  │     │
│  │  • Asset optimization                              │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  VIDEO PROCESSING LAYER                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │  VideoToFramesConverter.js                         │     │
│  │  • FFmpeg integration                              │     │
│  │  • Frame extraction logic                          │     │
│  │  • Video metadata analysis                         │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  FFmpeg (Bundled)                                  │     │
│  │  • ffmpeg-static                                   │     │
│  │  • ffprobe-static                                  │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── DropZone
│   └── [Handles file selection]
├── FileInfo
│   └── [Displays video metadata]
├── Controls
│   ├── Frame Mode Selector
│   ├── Frame Count Input
│   ├── Custom Frame Rate
│   └── Convert Button
├── ProgressBar
│   └── [Real-time progress]
└── StatusMessage
    └── [Success/error messages]
```

## Data Flow

```
1. User Action (DropZone)
   ↓
2. App.jsx (handleVideoSelection)
   ↓
3. IPC Call (window.electronAPI.getVideoInfo)
   ↓
4. Main Process (ipcMain.handle)
   ↓
5. VideoToFramesConverter
   ↓
6. FFmpeg (metadata extraction)
   ↓
7. Response back to React
   ↓
8. Update UI (FileInfo component)
```

## Conversion Flow

```
1. User clicks "Convert Images"
   ↓
2. Controls.jsx validates settings
   ↓
3. App.jsx calls handleConvert()
   ↓
4. IPC: window.electronAPI.convertVideo()
   ↓
5. Main Process receives request
   ↓
6. VideoToFramesConverter.convertVideo()
   ↓
7. FFmpeg extracts frames
   ↓
8. Progress events sent to renderer
   ↓
9. ProgressBar updates in real-time
   ↓
10. Completion notification
```

## Build Process

```
Development:
npm run electron:dev
    ↓
    ├─→ Vite Dev Server (Port 5173)
    │   └─→ Hot Module Replacement
    └─→ Electron loads from localhost:5173
        └─→ DevTools enabled

Production:
npm run build:win
    ↓
    ├─→ npm run build:react
    │   └─→ Vite builds to dist-react/
    └─→ electron-builder packages
        └─→ Creates installer in dist/
```

## IPC Communication

```
Renderer Process          Main Process
(React App)               (Electron)
    │                         │
    │  selectVideoFile()      │
    ├──────────────────────→  │
    │                         │ [File Dialog]
    │  ←──────────────────────┤
    │      videoPath          │
    │                         │
    │  getVideoInfo(path)     │
    ├──────────────────────→  │
    │                         │ [Analyze Video]
    │  ←──────────────────────┤
    │      metadata           │
    │                         │
    │  convertVideo(options)  │
    ├──────────────────────→  │
    │                         │ [Extract Frames]
    │  ←progress events────   │
    │  ←progress events────   │
    │  ←progress events────   │
    │  ←──────────────────────┤
    │      result             │
```

## File Structure

```
Frame-Splitter/
├── src/                        # React source
│   ├── components/             # UI components
│   ├── App.jsx                # Main app
│   ├── App.css                # Styles
│   └── index.jsx              # Entry point
├── public/                     # Static assets
│   └── index.html             # HTML template
├── dist-react/                 # Built React app
├── main-electron.js           # Electron main
├── preload.js                 # IPC bridge
├── VideoToFramesConverter.js  # Video logic
└── vite.config.js             # Build config
```

## Technology Stack Layers

```
┌─────────────────────────────┐
│   User Interface Layer      │
│     (React Components)      │
├─────────────────────────────┤
│    Application Logic        │
│      (React State)          │
├─────────────────────────────┤
│   IPC Communication         │
│    (Preload Script)         │
├─────────────────────────────┤
│    Desktop Runtime          │
│    (Electron Main)          │
├─────────────────────────────┤
│   Video Processing          │
│  (VideoToFramesConverter)   │
├─────────────────────────────┤
│   Native Layer              │
│   (FFmpeg Binaries)         │
└─────────────────────────────┘
```

## Development vs Production

```
Development Mode:
┌──────────────┐     ┌──────────────┐
│  Vite Server │────→│   Electron   │
│  (Hot Reload)│     │   (Window)   │
└──────────────┘     └──────────────┘
     :5173               loads from
                        localhost

Production Mode:
┌──────────────┐     ┌──────────────┐
│  dist-react/ │────→│   Electron   │
│ (Static Build)│     │   (Window)   │
└──────────────┘     └──────────────┘
    Built files         loads from
                         disk
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Easy to maintain and extend
- ✅ Fast development with HMR
- ✅ Secure IPC communication
- ✅ Native desktop performance
- ✅ Professional build system

# 🗂️ Frame Splitter - Clean Project Structure

This document describes the organized structure of the Frame Splitter project after cleanup.

## 📁 Root Directory Structure

```
Frame-Splitter/
├── 📄 Core Application Files
│   ├── main-electron.js          # Electron main process
│   ├── preload.js                # Electron preload script
│   ├── VideoToFramesConverter.js # Core video processing logic
│   ├── cli.js                    # Command-line interface
│   └── index.js                  # Node.js API entry point
│
├── ⚙️ Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── vite.config.js            # Vite bundler configuration
│   └── .gitignore                # Git ignore rules
│
├── 📚 Documentation
│   ├── README.md                 # Main project documentation
│   ├── RELEASE-NOTES-v1.0.0.md   # Release notes for v1.0.0
│   └── LICENSE                   # MIT License
│
├── 🎨 Assets
│   ├── icon.ico                  # Application icon (Windows)
│   └── Image spltter.png         # Logo/branding image
│
├── 📂 Source Code (src/)
│   ├── index.jsx                 # React app entry point
│   ├── index.css                 # Global styles
│   ├── App.jsx                   # Main React component
│   ├── App.css                   # App-specific styles
│   └── components/               # React components
│       ├── Controls.jsx          # Control buttons
│       ├── DropZone.jsx          # File drop zone
│       ├── FileInfo.jsx          # File information display
│       ├── ProgressBar.jsx       # Progress indicator
│       └── StatusMessage.jsx     # Status messages
│
├── 🌐 Public (public/)
│   └── index.html                # HTML template for React
│
├── 📝 Examples (examples/)
│   ├── README.md                 # Examples documentation
│   ├── basic-example.js          # Basic usage example
│   └── video-info-example.js     # Video info example
│
└── 🏗️ Build Output (Generated - Not in Git)
    ├── dist/                     # Electron build output
    ├── dist-react/               # React production build
    └── build/                    # Build resources
        └── icon.ico              # Icon for electron-builder
```

## 📄 File Descriptions

### Core Application Files

| File | Purpose |
|------|---------|
| `main-electron.js` | Electron main process - creates app window, handles IPC |
| `preload.js` | Electron preload script - exposes secure APIs to renderer |
| `VideoToFramesConverter.js` | Core video processing logic using FFmpeg |
| `cli.js` | Command-line interface for terminal usage |
| `index.js` | Node.js API entry point for programmatic usage |

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM package configuration, dependencies, scripts |
| `vite.config.js` | Vite configuration for React build |
| `.gitignore` | Git ignore patterns for build artifacts and temp files |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation with features, installation, usage |
| `RELEASE-NOTES-v1.0.0.md` | Detailed release notes for GitHub release |
| `LICENSE` | MIT License terms |

### Source Code (src/)

| File | Purpose |
|------|---------|
| `index.jsx` | React app entry point - renders App component |
| `index.css` | Global CSS styles |
| `App.jsx` | Main React component - app logic and state |
| `App.css` | App-specific CSS styles |
| **components/** | React UI components |
| `Controls.jsx` | File selection and split buttons |
| `DropZone.jsx` | Drag & drop file upload area |
| `FileInfo.jsx` | Display selected video information |
| `ProgressBar.jsx` | Extraction progress indicator |
| `StatusMessage.jsx` | User feedback messages |

## 🚀 Build Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run electron:dev     # Start Electron in dev mode with hot reload

# Building
npm run build:react      # Build React app
npm run build:win        # Build Windows installer + portable
npm run build:all        # Build for Windows, Mac, Linux

# Running
npm start               # Run Node.js version
npm run cli             # Run CLI version
npm run electron        # Run Electron GUI
```

## 📦 Output Directories (Not in Git)

| Directory | Contains |
|-----------|----------|
| `dist/` | Electron packaged applications (.exe, installers) |
| `dist-react/` | Compiled React application (HTML, CSS, JS) |
| `build/` | Build resources (icon.ico for electron-builder) |
| `node_modules/` | NPM dependencies |
| `frames/` | Default output directory for extracted frames |

## 🗑️ Removed Files (Cleaned Up)

The following files were removed to create a clean structure:

### Development Notes (Removed)
- `ARCHITECTURE.md`
- `BUILD-SUCCESS.md`
- `CHANGES-AUTO-DOWNLOAD.md`
- `CONVERSION-SUMMARY.md`
- `ERROR-EXPLANATION.md`
- `FEATURE-FRAME-CONTROL.md`
- `FFMPEG-FIX.md`
- `HOW-TO-UPDATE-LOGO.md`
- `QUICKSTART.md`
- `README-new.md`
- `README-REACT.md`
- `SUCCESS.md`
- `VISUAL-GUIDE.md`

### Utility Scripts (Removed)
- `create-icon-from-logo.js`
- `create-icon-from-new-logo.mjs`
- `create-icon.mjs`
- `save-image.ps1`
- `renderer.html` (old, replaced by React)

### Build Artifacts (Removed)
- `Frame-Splitter-Release-v1.0.0/` folder
- Extra logo files (`iamge-splitter-logo.jpg`, `logo.svg`)

**Note:** Executable files (.exe) should be distributed via GitHub Releases, not stored in the repository.

## 🎯 What to Keep in Git

✅ **Include:**
- All source code (`src/`, `*.js`, `*.jsx`)
- Configuration files (`package.json`, `vite.config.js`)
- Documentation (`README.md`, `LICENSE`)
- Assets (`icon.ico`, `Image spltter.png`)
- Examples (`examples/`)
- Build folder structure (with `icon.ico` only)

❌ **Exclude (via .gitignore):**
- `node_modules/`
- `dist/` and `dist-react/`
- `*.exe` files
- Test videos
- Output frames
- Temporary files
- Editor-specific files (`.vscode/`, `.idea/`)

## 📋 Best Practices

1. **Keep source code clean** - Only essential files in repository
2. **Use .gitignore** - Exclude build artifacts and dependencies
3. **Document changes** - Update README.md for significant changes
4. **Version control** - Use semantic versioning (v1.0.0, v1.1.0, etc.)
5. **GitHub Releases** - Distribute binaries via GitHub Releases page
6. **Examples** - Maintain working examples for users

## 🔄 Typical Workflow

1. **Development**: Edit files in `src/`, test with `npm run electron:dev`
2. **Build**: Run `npm run build:win` to create installer
3. **Test**: Install and test the built application
4. **Release**: Create GitHub release with binaries and release notes
5. **Commit**: Push only source code changes to Git

---

**Last Updated:** October 25, 2025  
**Version:** 1.0.0  
**Maintained by:** Kaif Ali

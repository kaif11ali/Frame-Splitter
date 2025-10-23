# Frame Splitter - React + Electron Native App

A modern desktop application built with React and Electron to convert videos into high-quality image frames.

## 🚀 Features

- **Native Desktop App**: Built with Electron for Windows, macOS, and Linux
- **Modern React UI**: Fast and responsive interface built with React 18
- **High-Quality Extraction**: Extract frames in original resolution
- **Multiple Modes**: Auto mode (1 frame/sec) or custom frame count
- **Progress Tracking**: Real-time progress updates during conversion
- **Drag & Drop**: Easy video file selection
- **Custom Settings**: Control frame rate and output location

## 📋 Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Frame-Splitter
```

2. Install dependencies:
```bash
npm install
```

## 🎯 Usage

### Development Mode

Run the app in development mode with hot-reload:

```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server on http://localhost:5173
2. Launch Electron with the React app
3. Enable hot-reload for instant updates

### Build React App Only

Build just the React frontend:

```bash
npm run build:react
```

### Run Electron (Production Mode)

Run Electron with the built React app:

```bash
npm run electron:build
```

### Build Installers

Build Windows installer:
```bash
npm run build:win
```

Build for all platforms:
```bash
npm run build:all
```

The built applications will be in the `dist` folder.

## 📁 Project Structure

```
Frame-Splitter/
├── src/                          # React source files
│   ├── components/               # React components
│   │   ├── DropZone.jsx         # Video file drop zone
│   │   ├── FileInfo.jsx         # Video metadata display
│   │   ├── Controls.jsx         # Conversion controls
│   │   ├── ProgressBar.jsx      # Progress indicator
│   │   └── StatusMessage.jsx    # Status notifications
│   ├── App.jsx                  # Main React component
│   ├── App.css                  # Application styles
│   ├── index.jsx                # React entry point
│   └── index.css                # Global styles
├── public/                       # Public assets
│   └── index.html               # HTML template
├── dist-react/                   # Built React app (generated)
├── main-electron.js             # Electron main process
├── preload.js                   # Electron preload script
├── VideoToFramesConverter.js    # Video conversion logic
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies & scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build:react` - Build React app for production
- `npm run electron` - Run Electron in development mode
- `npm run electron:dev` - Run full dev environment (React + Electron)
- `npm run electron:build` - Build React and run Electron
- `npm run build:win` - Build Windows installer
- `npm run build:all` - Build for all platforms

## 🎨 Technology Stack

- **Frontend**: React 18
- **UI Framework**: Custom CSS with Google Fonts
- **Build Tool**: Vite
- **Desktop Framework**: Electron 27
- **Video Processing**: FFmpeg (fluent-ffmpeg)
- **Package Manager**: npm

## 🔑 Key Features Explained

### Frame Extraction Modes

1. **Auto Mode (1 frame/sec)**: Extracts one frame for every second of video
2. **Custom Mode**: Specify exact number of frames to extract

### Custom Frame Rate

Enable custom frame rate to override the video's original frame rate during extraction.

### Output Options

- Choose any folder for output
- Default: Creates a `frames` folder next to the video file
- Frames are numbered sequentially (frame_0001.png, frame_0002.png, etc.)

## 🐛 Troubleshooting

### Development Server Issues

If the Electron window shows a blank screen:
1. Ensure Vite dev server is running on port 5173
2. Check if there are any console errors
3. Try `npm run electron:dev` instead of running commands separately

### Build Issues

If the build fails:
1. Delete `node_modules` and `dist-react` folders
2. Run `npm install` again
3. Try building again with `npm run build:win`

### FFmpeg Issues

If video conversion fails:
- The app includes FFmpeg binaries automatically
- Check if the video file format is supported
- Try converting the video to MP4 format first

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Made with ❤️ by KAIFALI

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

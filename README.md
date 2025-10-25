# 🎬 Frame Splitter - Video to Frames Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-Included-blue.svg)](https://ffmpeg.org/)

**Frame Splitter** is a powerful, professional-grade Node.js tool that converts any video into exactly 300 evenly spaced PNG frames while preserving the original resolution and highest quality. Perfect for video analysis, machine learning datasets, animation projects, and content creation.

## � Why Choose Frame Splitter?

### 🎯 **Perfect for Video Analysis**
- Extract frames for machine learning training datasets
- Analyze video content frame by frame
- Create thumbnails and previews
- Quality control and video inspection

### 🚀 **Professional Quality**
- **Highest Quality Output**: Uses FFmpeg with premium PNG settings (`-q:v 1`)
- **Original Resolution**: No quality loss, no upscaling/downscaling
- **Precise Frame Selection**: Mathematically calculated even spacing
- **Batch Processing**: Handle multiple videos efficiently

### 💼 **Multiple Use Cases**
- **Content Creation**: Extract frames for video editing
- **Animation**: Create sprite sheets and animation frames
- **Research**: Video analysis and computer vision projects
- **Quality Assurance**: Frame-by-frame video inspection
- **Thumbnails**: Generate high-quality video previews

### 🛠️ **Developer Friendly**
- **Multiple Interfaces**: CLI, programmatic API, and GUI
- **Cross-Platform**: Windows, macOS, and Linux support
- **Zero Configuration**: FFmpeg included, works out of the box
- **Comprehensive Logging**: Track progress and debug issues

---

## ✨ Key Features

- 🎯 **Precise Frame Extraction**: Always extracts exactly 300 evenly spaced frames
- 🌟 **Highest Quality Output**: Professional-grade PNG compression
- 📐 **Original Resolution**: Preserves source video dimensions perfectly
- 🖥️ **Multiple Interfaces**: CLI tool, Node.js API, and Electron GUI
- 🌐 **Cross-Platform**: Works seamlessly on Windows, macOS, and Linux
- 📊 **Progress Tracking**: Real-time progress bars and detailed logging
- 📦 **Batch Processing**: Convert multiple videos simultaneously
- 🧠 **Smart Frame Selection**: Intelligent timestamp calculation
- ⚡ **Fast Processing**: Optimized FFmpeg operations
- 🔧 **No Dependencies**: FFmpeg bundled, no external installations needed

---

## 📋 System Requirements

- **Node.js**: Version 14.0.0 or higher
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 4GB (8GB recommended for large videos)
- **Storage**: Sufficient space for output frames (300 PNG files per video)
- **FFmpeg**: Automatically included via ffmpeg-static

---

## 🚀 Installation Methods

### Method 1: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/kaif11ali/Frame-Splitter.git

# Navigate to the project directory
cd Frame-Splitter

# Install dependencies
npm install
```

### Method 2: Download ZIP

1. Visit the [GitHub Repository](https://github.com/kaif11ali/Frame-Splitter)
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file
5. Open terminal/command prompt in the extracted folder
6. Run `npm install`

### Method 3: NPM Global Installation (if published)

```bash
# Install globally (if available on NPM)
npm install -g video-to-frames

# Use anywhere
video-to-frames convert your-video.mp4
```

### 🔧 Verify Installation

```bash
# Check if Node.js is installed
node --version

# Test the tool
node cli.js --help

# Test with a sample video
node cli.js info your-video.mp4
```

## 💻 Usage

### CLI Usage

#### Convert a single video:
```bash
# Basic conversion
node cli.js convert path/to/video.mp4

# Specify output directory
node cli.js convert path/to/video.mp4 -o frames

# Custom quality (1-31, lower is better)
node cli.js convert path/to/video.mp4 -o frames -q 1
```

#### Get video information:
```bash
node cli.js info path/to/video.mp4
```

#### Batch convert multiple videos:
```bash
# Convert all videos in a directory
node cli.js batch path/to/videos/ -o output

# Specify video extensions
node cli.js batch path/to/videos/ -o output -e mp4 avi mov
```

#### Show help:
```bash
node cli.js --help
```

### Programmatic Usage

```javascript
const VideoToFramesConverter = require('./VideoToFramesConverter');

async function convertVideo() {
    const converter = new VideoToFramesConverter();
    
    try {
        const result = await converter.convertVideo('input.mp4', 'output-frames');
        console.log('Conversion completed:', result);
    } catch (error) {
        console.error('Conversion failed:', error.message);
    }
}

convertVideo();
```

### Electron GUI Usage

For the graphical interface:

```bash
npm run electron
```

The GUI features:
- Drag & drop video files
- Browse for video files and output folders
- Real-time progress tracking
- Video information display
- One-click conversion

## 📁 Output Structure

The tool creates PNG files with the following naming convention:

```
output-folder/
├── frame_001.png
├── frame_002.png
├── frame_003.png
...
└── frame_300.png
```

## 🔧 Configuration

### Supported Video Formats

- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- MKV (.mkv)
- WMV (.wmv)
- FLV (.flv)
- WebM (.webm)

### Output Settings

- **Format**: PNG
- **Quality**: Highest (`-q:v 1`)
- **Resolution**: Original video resolution (preserved)
- **Frame Count**: Exactly 300 frames
- **Spacing**: Evenly distributed across video duration

## 📊 How Frame Selection Works

The tool uses intelligent frame selection:

1. **Analyze Video**: Gets total frames and duration using FFprobe
2. **Calculate Spacing**: Determines frame interval (total_frames / 300)
3. **Extract Frames**: Selects frames at even intervals across the entire video
4. **Time-based Selection**: Uses timestamps for precise frame extraction

### Example:
- Video: 1800 frames, 60 seconds
- Interval: Every 6th frame (1800 ÷ 300 = 6)
- Timestamps: Every 0.2 seconds (60 ÷ 300 = 0.2s)

## 🛠️ API Reference

### VideoToFramesConverter Class

#### Methods

##### `convertVideo(videoPath, outputDir)`
Converts a video to 300 PNG frames.

**Parameters:**
- `videoPath` (string): Path to input video file
- `outputDir` (string, optional): Output directory (default: 'frames')

**Returns:** Promise resolving to conversion result object

##### `getVideoMetadata(videoPath)`
Gets detailed video information.

**Parameters:**
- `videoPath` (string): Path to video file

**Returns:** Promise resolving to metadata object

##### `batchConvert(videoPaths, baseOutputDir)`
Converts multiple videos.

**Parameters:**
- `videoPaths` (Array): Array of video file paths
- `baseOutputDir` (string, optional): Base output directory

**Returns:** Promise resolving to array of results

## 🐛 Error Handling

The tool includes comprehensive error handling for:

- Invalid video files
- Missing FFmpeg dependencies
- Insufficient disk space
- Corrupted video streams
- Permission issues
- Network-related problems (for remote files)

## 📝 Examples

### Basic CLI Example

```bash
# Convert a sample video
node cli.js convert sample-video.mp4 -o my-frames

# Check what would be extracted
node cli.js info sample-video.mp4
```

### Advanced Programmatic Example

```javascript
const VideoToFramesConverter = require('./VideoToFramesConverter');

async function advancedConversion() {
    const converter = new VideoToFramesConverter();
    
    // Get video info first
    try {
        const metadata = await converter.getVideoMetadata('input.mp4');
        console.log(`Video has ${metadata.totalFrames} frames`);
        console.log(`Will extract 300 frames (every ${Math.floor(metadata.totalFrames / 300)} frames)`);
        
        // Convert with custom settings
        const result = await converter.convertVideo('input.mp4', 'custom-output');
        
        console.log(`✅ Extracted ${result.totalFrames} frames`);
        console.log(`📁 Saved to: ${result.outputDirectory}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

advancedConversion();
```

### Batch Processing Example

```javascript
const VideoToFramesConverter = require('./VideoToFramesConverter');
const fs = require('fs');
const path = require('path');

async function batchProcess() {
    const converter = new VideoToFramesConverter();
    const videoDir = './videos';
    
    // Find all video files
    const files = fs.readdirSync(videoDir)
        .filter(file => /\.(mp4|avi|mov)$/i.test(file))
        .map(file => path.join(videoDir, file));
    
    console.log(`Found ${files.length} videos to process`);
    
    // Batch convert
    const results = await converter.batchConvert(files, 'batch-output');
    
    // Summary
    const successful = results.filter(r => r.success).length;
    console.log(`Successfully processed: ${successful}/${files.length} videos`);
}

batchProcess();
```

## 🔍 Troubleshooting

### Common Issues

1. **"FFmpeg not found"**
   - Solution: The tool includes ffmpeg-static, but ensure Node.js can access it
   - Try: `npm install ffmpeg-static --save`

2. **"Permission denied"**
   - Solution: Ensure write permissions for output directory
   - Try: Create output directory manually first

3. **"Invalid video format"**
   - Solution: Check if video file is corrupted
   - Try: `node cli.js info your-video.mp4` to verify

4. **"Out of memory"**
   - Solution: Process shorter videos or increase Node.js memory
   - Try: `node --max-old-space-size=4096 cli.js convert video.mp4`

### Performance Tips

- Use SSD storage for faster frame extraction
- Close unnecessary applications during processing
- Process videos locally (avoid network drives)
- Use smaller input videos for testing

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Made with ❤️ using Node.js, FFmpeg, and Electron**

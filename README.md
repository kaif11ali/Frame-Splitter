# Video to Frames Converter

A powerful Node.js tool that converts any video into exactly 300 evenly spaced PNG frames in the original resolution with highest quality. Features both CLI and optional Electron GUI interfaces.

## 🎬 Features

- **Precise Frame Extraction**: Always extracts exactly 300 evenly spaced frames
- **High Quality Output**: Uses FFmpeg with highest quality PNG settings (`-q:v 1`)
- **Original Resolution**: Preserves the original video resolution (no upscaling/downscaling)
- **Multiple Interfaces**: CLI tool, programmatic API, and optional Electron GUI
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Comprehensive Logging**: Progress tracking and detailed console output
- **Batch Processing**: Convert multiple videos at once
- **Smart Frame Selection**: Calculates optimal frame spacing based on video duration

## 📋 Requirements

- Node.js 14.0.0 or higher
- FFmpeg (automatically installed via ffmpeg-static)

## 🚀 Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
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
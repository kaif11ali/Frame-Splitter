# Example Usage Scripts

This directory contains example scripts showing different ways to use the Video to Frames Converter.

## Basic Example

```javascript
// basic-example.js
const VideoToFramesConverter = require('../VideoToFramesConverter');

async function basicExample() {
    const converter = new VideoToFramesConverter();
    
    try {
        console.log('Starting basic conversion...');
        const result = await converter.convertVideo('sample-video.mp4', 'basic-output');
        console.log('✅ Success!', result);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

basicExample();
```

## Get Video Info Example

```javascript
// video-info-example.js
const VideoToFramesConverter = require('../VideoToFramesConverter');

async function getVideoInfo() {
    const converter = new VideoToFramesConverter();
    
    try {
        const metadata = await converter.getVideoMetadata('sample-video.mp4');
        
        console.log('📊 Video Information:');
        console.log(`Duration: ${metadata.duration} seconds`);
        console.log(`Frame Rate: ${metadata.frameRate} fps`);
        console.log(`Total Frames: ${metadata.totalFrames}`);
        console.log(`Resolution: ${metadata.width}x${metadata.height}`);
        console.log(`Codec: ${metadata.codec}`);
        
        // Calculate what frames would be extracted
        const timestamps = converter.calculateFrameTimestamps(metadata.totalFrames, metadata.duration);
        console.log(`\n🎯 Would extract 300 frames at these intervals:`);
        console.log(`First 5 timestamps: ${timestamps.slice(0, 5).map(t => t.toFixed(2)).join('s, ')}s`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

getVideoInfo();
```

## Batch Processing Example

```javascript
// batch-example.js
const VideoToFramesConverter = require('../VideoToFramesConverter');
const fs = require('fs');
const path = require('path');

async function batchExample() {
    const converter = new VideoToFramesConverter();
    const inputDir = './videos'; // Directory containing videos
    
    try {
        // Find all video files
        const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv'];
        const videoFiles = fs.readdirSync(inputDir)
            .filter(file => videoExtensions.some(ext => file.toLowerCase().endsWith(ext)))
            .map(file => path.join(inputDir, file));
        
        if (videoFiles.length === 0) {
            console.log('No video files found in', inputDir);
            return;
        }
        
        console.log(`Found ${videoFiles.length} video(s) to process:`);
        videoFiles.forEach((file, i) => console.log(`  ${i + 1}. ${file}`));
        
        // Process all videos
        const results = await converter.batchConvert(videoFiles, 'batch-output');
        
        // Show results
        console.log('\n📊 Batch Processing Results:');
        results.forEach(result => {
            const status = result.success ? '✅' : '❌';
            const filename = path.basename(result.videoPath);
            console.log(`${status} ${filename}`);
            if (!result.success) {
                console.log(`   Error: ${result.error}`);
            }
        });
        
        const successful = results.filter(r => r.success).length;
        console.log(`\n🎯 Summary: ${successful}/${results.length} videos processed successfully`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

batchExample();
```

## Run Examples

```bash
# Make sure you have a sample video file first
# Then run any example:

node examples/basic-example.js
node examples/video-info-example.js
node examples/batch-example.js
```
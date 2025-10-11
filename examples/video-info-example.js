const VideoToFramesConverter = require('../VideoToFramesConverter');

async function videoInfoExample() {
    const converter = new VideoToFramesConverter();
    
    try {
        console.log('📊 Video Information Example');
        console.log('Note: Make sure you have a video file to analyze');
        
        const videoPath = 'sample-video.mp4'; // Change this to your video path
        
        console.log(`\nAnalyzing: ${videoPath}`);
        console.log('⏳ Please wait...\n');
        
        const metadata = await converter.getVideoMetadata(videoPath);
        
        console.log('📹 Video Metadata:');
        console.log(`  Duration: ${metadata.duration.toFixed(2)} seconds`);
        console.log(`  Frame Rate: ${metadata.frameRate.toFixed(2)} fps`);
        console.log(`  Total Frames: ${metadata.totalFrames.toLocaleString()}`);
        console.log(`  Resolution: ${metadata.width}x${metadata.height}`);
        console.log(`  Codec: ${metadata.codec}`);
        
        // Calculate frame extraction details
        const timestamps = converter.calculateFrameTimestamps(metadata.totalFrames, metadata.duration);
        const frameInterval = metadata.totalFrames / 300;
        const timeInterval = metadata.duration / 300;
        
        console.log('\n🎯 Frame Extraction Plan:');
        console.log(`  Target frames: 300`);
        console.log(`  Frame interval: Every ${frameInterval.toFixed(1)} frames`);
        console.log(`  Time interval: Every ${timeInterval.toFixed(2)} seconds`);
        
        console.log('\n⏱️ Sample timestamps (first 10):');
        timestamps.slice(0, 10).forEach((timestamp, i) => {
            const frameNum = String(i + 1).padStart(3, '0');
            console.log(`  frame_${frameNum}.png: ${timestamp.toFixed(2)}s`);
        });
        
        if (timestamps.length > 10) {
            console.log(`  ... and ${timestamps.length - 10} more frames`);
        }
        
        // Calculate file sizes (estimated)
        const estimatedFileSize = '~2-5 MB per frame (PNG, Full HD)';
        const totalEstimatedSize = '~600 MB - 1.5 GB total';
        
        console.log('\n📦 Estimated Output:');
        console.log(`  File size per frame: ${estimatedFileSize}`);
        console.log(`  Total estimated size: ${totalEstimatedSize}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Tips:');
        console.log('  1. Make sure you have a video file to analyze');
        console.log('  2. Place it in the root directory as "sample-video.mp4"');
        console.log('  3. Or modify the videoPath variable in this script');
        console.log('  4. Supported formats: MP4, AVI, MOV, MKV, WMV, FLV, WebM');
    }
}

// Run the example
if (require.main === module) {
    videoInfoExample();
}
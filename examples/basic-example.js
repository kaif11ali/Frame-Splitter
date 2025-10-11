const VideoToFramesConverter = require('../VideoToFramesConverter');

async function basicExample() {
    const converter = new VideoToFramesConverter();
    
    try {
        console.log('🎬 Starting basic conversion example...');
        console.log('Note: Make sure you have a video file named "sample-video.mp4" in the root directory');
        
        const videoPath = 'sample-video.mp4';
        const outputDir = 'basic-output';
        
        console.log(`Input: ${videoPath}`);
        console.log(`Output: ${outputDir}`);
        
        const result = await converter.convertVideo(videoPath, outputDir);
        
        console.log('\n✅ Conversion completed successfully!');
        console.log(`📁 Frames saved to: ${result.outputDirectory}`);
        console.log(`🎯 Total frames extracted: ${result.totalFrames}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Tips:');
        console.log('  1. Make sure you have a video file to test with');
        console.log('  2. Place it in the root directory as "sample-video.mp4"');
        console.log('  3. Or modify the videoPath variable above');
    }
}

// Run the example
if (require.main === module) {
    basicExample();
}
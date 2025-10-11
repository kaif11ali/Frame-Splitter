const VideoToFramesConverter = require('./VideoToFramesConverter');
const path = require('path');
const chalk = require('chalk');

/**
 * Simple usage example of the VideoToFramesConverter
 * Run this file directly: node index.js
 */
async function main() {
    console.log(chalk.blue('🎬 Video to Frames Converter'));
    console.log(chalk.gray('This is a simple example usage. Use cli.js for full CLI functionality.\n'));

    const converter = new VideoToFramesConverter();

    // Example usage - you can modify these paths
    const exampleVideoPath = './example-video.mp4'; // Change this to your video path
    const outputDirectory = './output-frames';

    try {
        // Uncomment the following lines and provide a real video path to test
        /*
        console.log(chalk.yellow('To test this converter:'));
        console.log(chalk.gray('1. Place a video file in this directory and update the exampleVideoPath variable'));
        console.log(chalk.gray('2. Uncomment the conversion code below'));
        console.log(chalk.gray('3. Run: node index.js'));
        console.log(chalk.gray('\nOr use the CLI tool:'));
        console.log(chalk.cyan('  node cli.js convert path/to/video.mp4 -o frames'));
        
        await converter.convertVideo(exampleVideoPath, outputDirectory);
        */

        console.log(chalk.yellow('💡 Usage Examples:'));
        console.log(chalk.gray('\nCLI Usage:'));
        console.log(chalk.cyan('  # Convert a single video'));
        console.log(chalk.white('  node cli.js convert path/to/video.mp4 -o frames'));
        console.log(chalk.cyan('\n  # Get video information'));
        console.log(chalk.white('  node cli.js info path/to/video.mp4'));
        console.log(chalk.cyan('\n  # Batch convert all videos in a directory'));
        console.log(chalk.white('  node cli.js batch path/to/videos/ -o output'));
        console.log(chalk.cyan('\n  # Show help'));
        console.log(chalk.white('  node cli.js --help'));

        console.log(chalk.gray('\nProgrammatic Usage:'));
        console.log(chalk.white(`
const VideoToFramesConverter = require('./VideoToFramesConverter');

async function convert() {
    const converter = new VideoToFramesConverter();
    
    try {
        const result = await converter.convertVideo('video.mp4', 'frames');
        console.log('Conversion completed:', result);
    } catch (error) {
        console.error('Conversion failed:', error.message);
    }
}

convert();
        `));

    } catch (error) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { VideoToFramesConverter };
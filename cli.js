#!/usr/bin/env node

const { Command } = require('commander');
const VideoToFramesConverter = require('./VideoToFramesConverter');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

program
    .name('video-to-frames')
    .description('Convert videos to exactly 300 evenly spaced PNG frames in full HD quality')
    .version('1.0.0');

program
    .command('convert')
    .description('Convert a video to 300 PNG frames')
    .argument('<video>', 'Path to the video file')
    .option('-o, --output <dir>', 'Output directory for frames', 'frames')
    .option('-q, --quality <number>', 'PNG quality (1-31, lower is better)', '1')
    .action(async (videoPath, options) => {
        const converter = new VideoToFramesConverter();
        
        try {
            // Validate video file
            if (!fs.existsSync(videoPath)) {
                console.error(chalk.red(`❌ Video file not found: ${videoPath}`));
                process.exit(1);
            }

            // Set quality if provided
            if (options.quality) {
                const quality = parseInt(options.quality);
                if (quality < 1 || quality > 31) {
                    console.error(chalk.red('❌ Quality must be between 1 and 31'));
                    process.exit(1);
                }
                converter.outputQuality = quality;
            }

            // Convert video
            await converter.convertVideo(videoPath, options.output);
            
        } catch (error) {
            console.error(chalk.red(`❌ Error: ${error.message}`));
            process.exit(1);
        }
    });

program
    .command('batch')
    .description('Convert multiple videos to frames')
    .argument('<pattern>', 'Glob pattern or directory containing videos')
    .option('-o, --output <dir>', 'Base output directory', 'frames')
    .option('-e, --extensions <ext...>', 'Video file extensions to process', ['mp4', 'avi', 'mov', 'mkv', 'wmv'])
    .action(async (pattern, options) => {
        const converter = new VideoToFramesConverter();
        
        try {
            let videoPaths = [];
            
            // If pattern is a directory, find all video files
            if (fs.existsSync(pattern) && fs.statSync(pattern).isDirectory()) {
                const files = fs.readdirSync(pattern);
                videoPaths = files
                    .filter(file => options.extensions.some(ext => 
                        file.toLowerCase().endsWith(`.${ext.toLowerCase()}`)))
                    .map(file => path.join(pattern, file));
            } else {
                // Assume it's a single file
                if (fs.existsSync(pattern)) {
                    videoPaths = [pattern];
                } else {
                    console.error(chalk.red(`❌ Path not found: ${pattern}`));
                    process.exit(1);
                }
            }

            if (videoPaths.length === 0) {
                console.error(chalk.red('❌ No video files found'));
                process.exit(1);
            }

            console.log(chalk.blue(`Found ${videoPaths.length} video(s) to process:`));
            videoPaths.forEach((path, i) => {
                console.log(chalk.gray(`  ${i + 1}. ${path}`));
            });

            await converter.batchConvert(videoPaths, options.output);
            
        } catch (error) {
            console.error(chalk.red(`❌ Error: ${error.message}`));
            process.exit(1);
        }
    });

program
    .command('info')
    .description('Get information about a video file')
    .argument('<video>', 'Path to the video file')
    .action(async (videoPath) => {
        const converter = new VideoToFramesConverter();
        
        try {
            if (!fs.existsSync(videoPath)) {
                console.error(chalk.red(`❌ Video file not found: ${videoPath}`));
                process.exit(1);
            }

            console.log(chalk.blue('📊 Analyzing video...'));
            const metadata = await converter.getVideoMetadata(videoPath);
            
            console.log(chalk.cyan('\nVideo Information:'));
            console.log(chalk.gray(`  File: ${videoPath}`));
            console.log(chalk.gray(`  Duration: ${metadata.duration.toFixed(2)} seconds`));
            console.log(chalk.gray(`  Frame Rate: ${metadata.frameRate.toFixed(2)} fps`));
            console.log(chalk.gray(`  Total Frames: ${metadata.totalFrames}`));
            console.log(chalk.gray(`  Resolution: ${metadata.width}x${metadata.height}`));
            console.log(chalk.gray(`  Codec: ${metadata.codec}`));
            
            const timestamps = converter.calculateFrameTimestamps(metadata.totalFrames, metadata.duration);
            console.log(chalk.yellow(`\n🎯 Would extract ${timestamps.length} frames at:`));
            console.log(chalk.gray(`  Frame interval: every ${(metadata.totalFrames / 300).toFixed(1)} frames`));
            console.log(chalk.gray(`  Time interval: every ${(metadata.duration / 300).toFixed(2)} seconds`));
            
        } catch (error) {
            console.error(chalk.red(`❌ Error: ${error.message}`));
            process.exit(1);
        }
    });

// Handle unknown commands
program.on('command:*', () => {
    console.error(chalk.red('❌ Invalid command. Use --help for available commands.'));
    process.exit(1);
});

// Parse command line arguments
if (process.argv.length === 2) {
    program.help();
} else {
    program.parse();
}
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeStatic = require('ffprobe-static');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ProgressBar = require('progress');

// Try to set FFmpeg path from multiple sources
try {
    if (ffmpegStatic) {
        ffmpeg.setFfmpegPath(ffmpegStatic);
    } else if (ffmpegInstaller.path) {
        ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    }
} catch (error) {
    console.log(chalk.yellow('⚠️  Using system FFmpeg installation'));
}

ffmpeg.setFfprobePath(ffprobeStatic.path);

class VideoToFramesConverter {
    constructor() {
        this.targetFrameCount = 300;
        this.outputQuality = 1; // Highest quality for PNG
        this.ffmpegCapabilities = null;
    }

    /**
     * Check FFmpeg capabilities and available encoders
     * @returns {Promise<Object>} Available encoders and formats
     */
    async checkFFmpegCapabilities() {
        if (this.ffmpegCapabilities) {
            return this.ffmpegCapabilities;
        }

        return new Promise((resolve, reject) => {
            ffmpeg.getAvailableEncoders((err, encoders) => {
                if (err) {
                    console.log(chalk.yellow('⚠️  Could not check encoders, using defaults'));
                    this.ffmpegCapabilities = { png: false, mjpeg: true };
                    resolve(this.ffmpegCapabilities);
                    return;
                }

                this.ffmpegCapabilities = {
                    png: !!encoders.png || !!encoders.libpng,
                    mjpeg: !!encoders.mjpeg,
                    bmp: !!encoders.bmp,
                    encoders: Object.keys(encoders)
                };

                console.log(chalk.gray(`Available image encoders: ${this.ffmpegCapabilities.encoders.filter(e => ['png', 'libpng', 'mjpeg', 'bmp'].includes(e)).join(', ')}`));
                resolve(this.ffmpegCapabilities);
            });
        });
    }

    /**
     * Get video metadata including total frames and duration
     * @param {string} videoPath - Path to the video file
     * @returns {Promise<Object>} Video metadata
     */
    async getVideoMetadata(videoPath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) {
                    reject(new Error(`Failed to probe video: ${err.message}`));
                    return;
                }

                const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
                if (!videoStream) {
                    reject(new Error('No video stream found in the file'));
                    return;
                }

                const duration = parseFloat(videoStream.duration || metadata.format.duration);
                const frameRate = eval(videoStream.r_frame_rate); // e.g., "30/1" -> 30
                const totalFrames = Math.floor(duration * frameRate);

                resolve({
                    duration,
                    frameRate,
                    totalFrames,
                    width: videoStream.width,
                    height: videoStream.height,
                    codec: videoStream.codec_name
                });
            });
        });
    }

    /**
     * Calculate frame timestamps for even spacing
     * @param {number} totalFrames - Total frames in video
     * @param {number} duration - Video duration in seconds
     * @returns {Array<number>} Array of timestamps in seconds
     */
    calculateFrameTimestamps(totalFrames, duration) {
        const timestamps = [];
        const interval = totalFrames / this.targetFrameCount;
        
        for (let i = 0; i < this.targetFrameCount; i++) {
            const frameIndex = Math.floor(i * interval);
            const timestamp = (frameIndex / totalFrames) * duration;
            timestamps.push(timestamp);
        }
        
        return timestamps;
    }

    /**
     * Ensure output directory exists
     * @param {string} outputDir - Output directory path
     */
    ensureOutputDirectory(outputDir) {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(chalk.green(`✓ Created output directory: ${outputDir}`));
        }
    }

    /**
     * Extract a single frame at specified timestamp
     * @param {string} videoPath - Path to video file
     * @param {number} timestamp - Timestamp in seconds
     * @param {string} outputPath - Output file path
     * @param {Object} metadata - Video metadata containing original resolution
     * @returns {Promise<void>}
     */
    async extractFrame(videoPath, timestamp, outputPath, metadata = null) {
        // Check capabilities first
        const capabilities = await this.checkFFmpegCapabilities();
        
        return new Promise((resolve, reject) => {
            const command = ffmpeg(videoPath)
                .seekInput(timestamp)
                .frames(1);
            
            // Use original resolution if metadata is provided, otherwise keep original size
            if (metadata && metadata.width && metadata.height) {
                command.size(`${metadata.width}x${metadata.height}`);
            }
            // If no metadata or size specified, FFmpeg will use original resolution by default
            
            command.output(outputPath);

            // Use the best available encoder
            if (capabilities.png) {
                command.outputOptions([
                    '-y', // Overwrite output files
                    '-f', 'image2',
                    '-vcodec', 'png',
                    '-q:v', '1'
                ]);
            } else if (capabilities.mjpeg) {
                // Fallback to JPEG if PNG not available
                const jpegPath = outputPath.replace('.png', '.jpg');
                command
                    .output(jpegPath)
                    .outputOptions([
                        '-y',
                        '-f', 'image2',
                        '-vcodec', 'mjpeg',
                        '-q:v', '1'
                    ])
                    .on('end', () => {
                        // Convert JPEG to PNG using a simple rename (for compatibility)
                        fs.renameSync(jpegPath, outputPath);
                        resolve();
                    });
            } else {
                // Basic fallback
                command.outputOptions([
                    '-y',
                    '-q:v', '1'
                ]);
            }

            command
                .on('end', () => {
                    if (!capabilities.mjpeg || capabilities.png) {
                        resolve();
                    }
                })
                .on('error', (err) => {
                    console.log(chalk.red(`Frame extraction error: ${err.message}`));
                    reject(err);
                })
                .run();
        });
    }

    /**
     * Convert video to 300 evenly spaced frames
     * @param {string} videoPath - Path to input video
     * @param {string} outputDir - Output directory (defaults to 'frames')
     * @returns {Promise<void>}
     */
    async convertVideo(videoPath, outputDir = 'frames') {
        try {
            console.log(chalk.blue('🎬 Starting video to frames conversion...'));
            console.log(chalk.gray(`Input: ${videoPath}`));
            console.log(chalk.gray(`Output: ${outputDir}`));
            console.log(chalk.gray(`Target frames: ${this.targetFrameCount}`));

            // Validate input file
            if (!fs.existsSync(videoPath)) {
                throw new Error(`Video file not found: ${videoPath}`);
            }

            // Create output directory
            this.ensureOutputDirectory(outputDir);

            // Get video metadata
            console.log(chalk.yellow('📊 Analyzing video metadata...'));
            const metadata = await this.getVideoMetadata(videoPath);
            
            console.log(chalk.cyan(`Video info:`));
            console.log(chalk.gray(`  Duration: ${metadata.duration.toFixed(2)}s`));
            console.log(chalk.gray(`  Frame rate: ${metadata.frameRate.toFixed(2)} fps`));
            console.log(chalk.gray(`  Total frames: ${metadata.totalFrames}`));
            console.log(chalk.gray(`  Resolution: ${metadata.width}x${metadata.height}`));
            console.log(chalk.gray(`  Codec: ${metadata.codec}`));
            console.log(chalk.green(`  Output resolution: Original (${metadata.width}x${metadata.height})`));

            // Calculate frame timestamps
            const timestamps = this.calculateFrameTimestamps(metadata.totalFrames, metadata.duration);
            console.log(chalk.yellow(`🎯 Calculated ${timestamps.length} evenly spaced timestamps`));

            // Create progress bar
            const progressBar = new ProgressBar(
                chalk.green('Extracting frames [:bar] :current/:total (:percent) ETA: :eta'),
                {
                    complete: '█',
                    incomplete: '░',
                    width: 40,
                    total: this.targetFrameCount
                }
            );

            // Extract frames
            for (let i = 0; i < timestamps.length; i++) {
                const timestamp = timestamps[i];
                const frameNumber = String(i + 1).padStart(3, '0');
                const outputPath = path.join(outputDir, `frame_${frameNumber}.png`);

                try {
                    await this.extractFrame(videoPath, timestamp, outputPath, metadata);
                    progressBar.tick();
                } catch (error) {
                    console.error(chalk.red(`❌ Failed to extract frame ${frameNumber}: ${error.message}`));
                    throw error;
                }
            }

            console.log(chalk.green(`\n✅ Successfully extracted ${this.targetFrameCount} frames!`));
            console.log(chalk.gray(`Frames saved to: ${path.resolve(outputDir)}`));
            
            return {
                success: true,
                totalFrames: this.targetFrameCount,
                outputDirectory: path.resolve(outputDir),
                originalVideoInfo: metadata
            };

        } catch (error) {
            console.error(chalk.red(`❌ Conversion failed: ${error.message}`));
            throw error;
        }
    }

    /**
     * Batch convert multiple videos
     * @param {Array<string>} videoPaths - Array of video file paths
     * @param {string} baseOutputDir - Base output directory
     * @returns {Promise<Array>} Results for each video
     */
    async batchConvert(videoPaths, baseOutputDir = 'frames') {
        const results = [];
        
        console.log(chalk.blue(`🎬 Starting batch conversion of ${videoPaths.length} videos...`));
        
        for (let i = 0; i < videoPaths.length; i++) {
            const videoPath = videoPaths[i];
            const videoName = path.basename(videoPath, path.extname(videoPath));
            const outputDir = path.join(baseOutputDir, videoName);
            
            console.log(chalk.yellow(`\n📹 Processing video ${i + 1}/${videoPaths.length}: ${videoName}`));
            
            try {
                const result = await this.convertVideo(videoPath, outputDir);
                results.push({ videoPath, success: true, result });
            } catch (error) {
                results.push({ videoPath, success: false, error: error.message });
            }
        }
        
        console.log(chalk.green(`\n✅ Batch conversion completed!`));
        const successful = results.filter(r => r.success).length;
        console.log(chalk.gray(`Successfully processed: ${successful}/${videoPaths.length} videos`));
        
        return results;
    }
}

module.exports = VideoToFramesConverter;
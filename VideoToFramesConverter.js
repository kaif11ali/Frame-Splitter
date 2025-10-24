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
        // Replace .asar paths to work in packaged app
        const ffmpegPath = ffmpegStatic.replace('app.asar', 'app.asar.unpacked');
        ffmpeg.setFfmpegPath(ffmpegPath);
        console.log('FFmpeg path:', ffmpegPath);
    } else if (ffmpegInstaller.path) {
        const ffmpegPath = ffmpegInstaller.path.replace('app.asar', 'app.asar.unpacked');
        ffmpeg.setFfmpegPath(ffmpegPath);
        console.log('FFmpeg path:', ffmpegPath);
    }
} catch (error) {
    console.log(chalk.yellow('⚠️  Using system FFmpeg installation'));
}

// Set ffprobe path with ASAR fix
try {
    const ffprobePath = ffprobeStatic.path.replace('app.asar', 'app.asar.unpacked');
    ffmpeg.setFfprobePath(ffprobePath);
    console.log('FFprobe path:', ffprobePath);
} catch (error) {
    console.log(chalk.yellow('⚠️  Using system FFprobe installation'));
}

class VideoToFramesConverter {
    constructor() {
        this.targetFrameCount = 300;
        this.outputQuality = 1; // Highest quality for PNG
        this.ffmpegCapabilities = null;
        this.customFrameRate = null; // Custom frame rate (null = use video's original)
        this.autoFrameCount = true; // Automatically calculate frame count based on video
    }

    /**
     * Set the number of frames to extract
     * @param {number} count - Number of frames to extract
     */
    setTargetFrameCount(count) {
        this.targetFrameCount = count;
        this.autoFrameCount = false;
    }

    /**
     * Enable automatic frame count based on video duration and frame rate
     */
    enableAutoFrameCount() {
        this.autoFrameCount = true;
    }

    /**
     * Set custom frame rate for extraction
     * @param {number|null} fps - Custom frame rate (null to use original)
     */
    setCustomFrameRate(fps) {
        this.customFrameRate = fps;
    }

    /**
     * Calculate optimal frame count based on video metadata
     * @param {Object} metadata - Video metadata
     * @returns {number} Calculated frame count
     */
    calculateAutoFrameCount(metadata) {
        // Extract 1 frame per second by default for auto mode
        return Math.min(Math.floor(metadata.duration), metadata.totalFrames);
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
     * @param {number} targetCount - Target number of frames to extract
     * @returns {Array<number>} Array of timestamps in seconds
     */
    calculateFrameTimestamps(totalFrames, duration, targetCount) {
        const timestamps = [];
        const interval = totalFrames / targetCount;
        
        for (let i = 0; i < targetCount; i++) {
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
     * Convert video to frames
     * @param {string} videoPath - Path to input video
     * @param {string} outputDir - Output directory (defaults to 'frames')
     * @param {Object} options - Conversion options
     * @param {number} options.frameCount - Number of frames to extract (overrides auto)
     * @param {number} options.frameRate - Custom frame rate (overrides original)
     * @returns {Promise<void>}
     */
    async convertVideo(videoPath, outputDir = 'frames', options = {}) {
        try {
            console.log(chalk.blue('🎬 Starting video to frames conversion...'));
            console.log(chalk.gray(`Input: ${videoPath}`));
            console.log(chalk.gray(`Output: ${outputDir}`));

            // Validate input file
            if (!fs.existsSync(videoPath)) {
                throw new Error(`Video file not found: ${videoPath}`);
            }

            // Create output directory
            this.ensureOutputDirectory(outputDir);

            // Get video metadata
            console.log(chalk.yellow('📊 Analyzing video metadata...'));
            const metadata = await this.getVideoMetadata(videoPath);
            
            // Determine frame count
            let actualFrameCount;
            if (options.frameCount) {
                actualFrameCount = options.frameCount;
                this.targetFrameCount = actualFrameCount;
            } else if (this.autoFrameCount) {
                actualFrameCount = this.calculateAutoFrameCount(metadata);
                this.targetFrameCount = actualFrameCount;
            } else {
                actualFrameCount = this.targetFrameCount;
            }

            // Apply custom frame rate if specified
            let effectiveFrameRate = metadata.frameRate;
            if (options.frameRate || this.customFrameRate) {
                effectiveFrameRate = options.frameRate || this.customFrameRate;
                console.log(chalk.cyan(`Using custom frame rate: ${effectiveFrameRate} fps`));
            }
            
            console.log(chalk.cyan(`Video info:`));
            console.log(chalk.gray(`  Duration: ${metadata.duration.toFixed(2)}s`));
            console.log(chalk.gray(`  Frame rate: ${metadata.frameRate.toFixed(2)} fps (original)`));
            if (effectiveFrameRate !== metadata.frameRate) {
                console.log(chalk.gray(`  Effective frame rate: ${effectiveFrameRate.toFixed(2)} fps (custom)`));
            }
            console.log(chalk.gray(`  Total frames: ${metadata.totalFrames}`));
            console.log(chalk.gray(`  Resolution: ${metadata.width}x${metadata.height}`));
            console.log(chalk.gray(`  Codec: ${metadata.codec}`));
            console.log(chalk.gray(`  Output resolution: Original (${metadata.width}x${metadata.height})`));
            console.log(chalk.cyan(`  Extracting: ${actualFrameCount} frames ${this.autoFrameCount ? '(auto)' : '(manual)'}`));

            // Calculate frame timestamps
            const timestamps = this.calculateFrameTimestamps(metadata.totalFrames, metadata.duration, actualFrameCount);
            console.log(chalk.yellow(`🎯 Calculated ${timestamps.length} evenly spaced timestamps`));

            // Create progress bar
            const progressBar = new ProgressBar(
                chalk.green('Extracting frames [:bar] :current/:total (:percent) ETA: :eta'),
                {
                    complete: '█',
                    incomplete: '░',
                    width: 40,
                    total: actualFrameCount
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

            console.log(chalk.green(`\n✅ Successfully extracted ${actualFrameCount} frames!`));
            console.log(chalk.gray(`Frames saved to: ${path.resolve(outputDir)}`));
            
            return {
                success: true,
                totalFrames: actualFrameCount,
                outputDirectory: path.resolve(outputDir),
                originalVideoInfo: metadata,
                extractionMode: this.autoFrameCount ? 'auto' : 'manual',
                effectiveFrameRate: effectiveFrameRate
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
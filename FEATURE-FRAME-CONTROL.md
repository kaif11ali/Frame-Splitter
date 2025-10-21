# Frame Count and Frame Rate Control Feature

## Overview
This feature adds advanced control over frame extraction, allowing users to choose between automatic and custom frame counts, as well as set custom frame rates.

## New Features

### 1. **Frame Count Mode**
Users can now choose between two modes:

#### Auto Mode (Default)
- Automatically extracts 1 frame per second from the video
- Intelligently calculates the optimal number of frames based on video duration
- Example: A 60-second video will extract approximately 60 frames
- Best for: Quick previews, video summaries, or when you want consistent temporal spacing

#### Custom Mode
- Allows users to specify exactly how many frames to extract
- Can extract anywhere from 1 to 10,000 frames
- Frames are evenly spaced throughout the video duration
- Best for: Precise control, creating specific frame counts for analysis or processing

### 2. **Custom Frame Rate**
- Option to override the original video frame rate
- Useful for:
  - Normalizing videos with different frame rates
  - Creating consistent output across multiple videos
  - Adjusting extraction timing for specific use cases
- Range: 1 to 120 fps

## UI Components

### Frame Count Mode Selector
- **Location**: Main controls section
- **Options**:
  - "Auto (1 frame/sec)" - Automatic calculation
  - "Custom Count" - Manual frame count input
- **Help Tooltip**: Explains the difference between modes

### Number of Frames Input
- **Type**: Number input field
- **Range**: 1 to 10,000 frames
- **State**: 
  - Disabled in Auto mode (shows calculated count as placeholder)
  - Enabled in Custom mode
- **Default**: 300 frames in Custom mode

### Custom Frame Rate Checkbox
- **Purpose**: Enable/disable custom frame rate override
- **Default**: Unchecked (uses original video frame rate)

### Frame Rate Input
- **Type**: Number input field
- **Range**: 1 to 120 fps
- **Step**: 0.01 (supports decimal values)
- **Visibility**: Only shown when "Use Custom Frame Rate" is checked
- **Auto-fill**: Pre-fills with original video frame rate when enabled

## How It Works

### Backend Changes (VideoToFramesConverter.js)

1. **New Properties**:
   ```javascript
   this.autoFrameCount = true;  // Auto mode by default
   this.customFrameRate = null; // No custom frame rate by default
   ```

2. **New Methods**:
   - `setTargetFrameCount(count)` - Set custom frame count
   - `enableAutoFrameCount()` - Enable automatic mode
   - `setCustomFrameRate(fps)` - Set custom frame rate
   - `calculateAutoFrameCount(metadata)` - Calculate optimal frame count

3. **Updated Methods**:
   - `convertVideo()` - Now accepts options object for frame count and frame rate
   - `calculateFrameTimestamps()` - Now accepts target count as parameter

### Frontend Changes (renderer.html)

1. **New UI Controls**:
   - Frame mode selector (dropdown)
   - Frame count input (number field)
   - Custom frame rate checkbox
   - Frame rate input (number field with decimal support)

2. **Event Handlers**:
   - Frame mode change handler
   - Custom frame rate toggle handler
   - Validation for user inputs

3. **Enhanced Video Info Display**:
   - Shows calculated frame count for auto mode
   - Displays both original and custom frame rates when applicable

### IPC Communication (main-electron.js & preload.js)

- Updated `convert-video` handler to accept and process options
- Options object structure:
  ```javascript
  {
    frameCount: number,      // Optional: custom frame count
    autoFrameCount: boolean, // Optional: enable auto mode
    frameRate: number        // Optional: custom frame rate
  }
  ```

## Usage Examples

### Example 1: Auto Mode (Default)
1. Select a video
2. Keep "Auto (1 frame/sec)" selected
3. Click "Convert Video"
4. Result: Extracts 1 frame per second (e.g., 120 frames from a 2-minute video)

### Example 2: Custom Frame Count
1. Select a video
2. Choose "Custom Count" from dropdown
3. Enter desired number (e.g., 500)
4. Click "Convert Video"
5. Result: Extracts exactly 500 evenly-spaced frames

### Example 3: Custom Frame Rate
1. Select a video
2. Check "Use Custom Frame Rate"
3. Enter desired frame rate (e.g., 24 fps)
4. Click "Convert Video"
5. Result: Processes video using 24 fps timing (useful for normalizing videos)

### Example 4: Both Custom Settings
1. Select a video
2. Choose "Custom Count" and enter 1000
3. Check "Use Custom Frame Rate" and enter 30 fps
4. Click "Convert Video"
5. Result: Extracts 1000 frames using 30 fps timing

## Technical Details

### Frame Extraction Algorithm

**Even Distribution**:
Frames are extracted with even spacing across the entire video duration:

```javascript
interval = totalFrames / targetFrameCount
for (i = 0; i < targetFrameCount; i++) {
    frameIndex = floor(i * interval)
    timestamp = (frameIndex / totalFrames) * duration
}
```

**Auto Mode Calculation**:
```javascript
autoFrameCount = min(floor(duration), totalFrames)
```
This ensures:
- One frame per second of video
- Never exceeds total available frames
- Always gets at least 1 frame for videos < 1 second

### Progress Tracking

The progress bar dynamically adapts to the selected frame count:
- Shows "X/Y" where Y is the actual target frame count
- Percentage calculation updates accordingly
- ETA adjusts based on current extraction speed

## Benefits

1. **Flexibility**: Users can choose the best extraction method for their needs
2. **Efficiency**: Auto mode provides sensible defaults without requiring user input
3. **Precision**: Custom mode allows exact control for specific requirements
4. **Consistency**: Custom frame rate helps normalize videos from different sources
5. **User-Friendly**: Clear UI with helpful tooltips and validation

## Backward Compatibility

The feature maintains full backward compatibility:
- Default behavior (auto mode) is user-friendly for new users
- Previous 300-frame default is still available as a custom option
- Existing API calls work without modification (uses defaults)
- Command-line interface can be extended with new flags

## Future Enhancements

Possible improvements:
1. Frame range selection (extract specific time ranges)
2. Variable frame rate (different rates for different sections)
3. Keyframe-only extraction
4. Scene-based extraction (detect scene changes)
5. Presets (e.g., "Quick Preview", "High Quality", "Animation")
6. Batch processing with different settings per video

## Testing Recommendations

1. **Test with various video lengths**:
   - Short videos (< 10 seconds)
   - Medium videos (1-5 minutes)
   - Long videos (> 10 minutes)

2. **Test edge cases**:
   - Frame count = 1
   - Frame count > total video frames
   - Very high frame rates (> 60 fps)
   - Very low frame rates (< 5 fps)

3. **Test combinations**:
   - Auto mode with custom frame rate
   - Custom mode with original frame rate
   - Both custom settings

4. **Test validation**:
   - Invalid frame counts (0, negative, non-numeric)
   - Invalid frame rates (0, negative, very high values)
   - Empty fields

## Notes

- Frame extraction uses FFmpeg's seek functionality for precision
- All frames maintain original video resolution
- Frame numbering starts at 001 and increments sequentially
- Output format is PNG for highest quality (with fallback to JPEG if needed)

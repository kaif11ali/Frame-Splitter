import React, { useState, useEffect } from 'react';

const Controls = ({
  videoMetadata,
  selectedOutputPath,
  onOutputPathChange,
  onSelectOutput,
  onConvert,
  isConverting,
  hasVideo,
  conversionComplete,
}) => {
  const [frameMode, setFrameMode] = useState('auto');
  const [frameCount, setFrameCount] = useState('');
  const [customFrameRate, setCustomFrameRate] = useState(false);
  const [frameRate, setFrameRate] = useState('');

  useEffect(() => {
    if (videoMetadata && customFrameRate) {
      setFrameRate(videoMetadata.frameRate.toFixed(2));
    }
  }, [videoMetadata, customFrameRate]);

  const handleFrameModeChange = (e) => {
    const mode = e.target.value;
    setFrameMode(mode);

    if (mode === 'custom') {
      setFrameCount('300');
    } else {
      setFrameCount('');
    }
  };

  const handleConvert = () => {
    if (!hasVideo) {
      alert('Please select a video file.');
      return;
    }

    const options = {};

    if (frameMode === 'auto') {
      options.autoFrameCount = true;
    } else {
      const count = parseInt(frameCount);
      if (!count || count < 1) {
        alert('Please enter a valid frame count.');
        return;
      }
      options.frameCount = count;
    }

    if (customFrameRate) {
      const rate = parseFloat(frameRate);
      if (!rate || rate < 1) {
        alert('Please enter a valid frame rate.');
        return;
      }
      options.frameRate = rate;
    }

    onConvert(options);
  };

  const autoFramePlaceholder = videoMetadata
    ? `Auto: ~${Math.min(
        Math.floor(videoMetadata.duration),
        videoMetadata.totalFrames
      )} frames`
    : 'e.g., 300';

  return (
    <div className="controls">
      <div className="input-row">
        <div className="input-group">
          <label htmlFor="frameMode">
            <span className="label-inline">
              Frame Count Mode
              <span
                className="info-tooltip"
                title="Auto: Extract 1 frame per second&#10;Custom: Specify exact number of frames"
              >
                ?
              </span>
            </span>
          </label>
          <select
            id="frameMode"
            value={frameMode}
            onChange={handleFrameModeChange}
          >
            <option value="auto">Auto (1 frame/sec)</option>
            <option value="custom">Custom Count</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="frameCount">Number of Frames:</label>
          <input
            type="number"
            id="frameCount"
            placeholder={autoFramePlaceholder}
            min="1"
            max="10000"
            value={frameCount}
            onChange={(e) => setFrameCount(e.target.value)}
            disabled={frameMode === 'auto'}
          />
        </div>
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          id="customFrameRate"
          checked={customFrameRate}
          onChange={(e) => setCustomFrameRate(e.target.checked)}
        />
        <label htmlFor="customFrameRate">Use Custom Frame Rate</label>
      </div>

      {customFrameRate && (
        <div className="input-group">
          <label htmlFor="frameRate">Frame Rate (fps):</label>
          <input
            type="number"
            id="frameRate"
            placeholder="e.g., 30"
            min="1"
            max="120"
            step="0.01"
            value={frameRate}
            onChange={(e) => setFrameRate(e.target.value)}
          />
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleConvert}
        disabled={!hasVideo || isConverting}
        style={conversionComplete ? { background: '#4CAF50' } : {}}
      >
        {conversionComplete ? '✅ Images Converted' : 'Convert Images'}
      </button>

      {conversionComplete && (
        <div className="conversion-complete-message">
          <p
            style={{
              color: '#4CAF50',
              fontWeight: 600,
              marginTop: '15px',
              fontSize: '1.05em',
            }}
          >
            ✅ Saved in your Downloads folder
          </p>
        </div>
      )}
    </div>
  );
};

export default Controls;

import React from 'react';

const FileInfo = ({ videoMetadata, videoPath }) => {
  if (!videoMetadata || !videoPath) return null;

  const fileName = videoPath.split(/[\\/]/).pop();

  return (
    <div className="file-info">
      <h3>📊 Video Information</h3>
      <div className="file-info-grid">
        <div className="file-info-item">
          <span className="file-info-label">File:</span> {fileName}
        </div>
        <div className="file-info-item">
          <span className="file-info-label">Duration:</span>{' '}
          {videoMetadata.duration.toFixed(2)}s
        </div>
        <div className="file-info-item">
          <span className="file-info-label">Frame Rate:</span>{' '}
          {videoMetadata.frameRate.toFixed(2)} fps
        </div>
        <div className="file-info-item">
          <span className="file-info-label">Total Frames:</span>{' '}
          {videoMetadata.totalFrames.toLocaleString()}
        </div>
        <div className="file-info-item">
          <span className="file-info-label">Resolution:</span>{' '}
          {videoMetadata.width}x{videoMetadata.height}
        </div>
        <div className="file-info-item">
          <span className="file-info-label">Codec:</span> {videoMetadata.codec}
        </div>
      </div>
    </div>
  );
};

export default FileInfo;

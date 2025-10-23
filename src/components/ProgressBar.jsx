import React from 'react';

const ProgressBar = ({ progress, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="progress-container">
      <div className="progress-text">
        Extracting frames... {progress.current}/{progress.total} ({progress.percent}%)
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress.percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

import React, { useState } from 'react';

const DropZone = ({ onVideoSelect, hasVideo }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(
      (file) =>
        file.type.startsWith('video/') ||
        /\.(mp4|avi|mov|mkv|wmv|flv|webm)$/i.test(file.name)
    );

    if (videoFile) {
      onVideoSelect(videoFile.path);
    } else {
      alert('Please drop a valid video file.');
    }
  };

  const handleClick = async () => {
    const videoPath = await window.electronAPI.selectVideoFile();
    if (videoPath) {
      onVideoSelect(videoPath);
    }
  };

  return (
    <div
      className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${
        hasVideo ? 'file-selected' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="icon">
        <img
          src="Image spltter.png"
          alt="Drop icon"
          style={{ width: '80px', height: '80px', opacity: 0.6 }}
        />
      </div>
      <div className="drop-zone-text">Drag and drop your video file here</div>
      <div className="drop-zone-subtext">or</div>
      <button className="btn btn-primary" style={{ marginTop: '15px' }}>
        {hasVideo ? '✓ File Selected' : 'Select Video File'}
      </button>
    </div>
  );
};

export default DropZone;

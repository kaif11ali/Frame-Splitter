import React, { useState, useEffect } from 'react';
import './App.css';
import DropZone from './components/DropZone';
import FileInfo from './components/FileInfo';
import Controls from './components/Controls';
import ProgressBar from './components/ProgressBar';
import StatusMessage from './components/StatusMessage';

function App() {
  const [selectedVideoPath, setSelectedVideoPath] = useState('');
  const [selectedOutputPath, setSelectedOutputPath] = useState('');
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [status, setStatus] = useState({ message: '', type: '' });
  const [conversionComplete, setConversionComplete] = useState(false);

  useEffect(() => {
    // Listen for conversion progress
    window.electronAPI.onConversionProgress((data) => {
      setProgress(data);
    });

    return () => {
      window.electronAPI.removeAllListeners('conversion-progress');
    };
  }, []);

  const handleVideoSelection = async (videoPath) => {
    setSelectedVideoPath(videoPath);
    setConversionComplete(false);
    showStatus('Analyzing video...', 'info');

    try {
      const result = await window.electronAPI.getVideoInfo(videoPath);

      if (result.success) {
        setVideoMetadata(result.data);

        // Always use Downloads folder
        const downloadsPath = await window.electronAPI.getDownloadsPath();
        setSelectedOutputPath(downloadsPath + '/FrameSplitter-Output');

        showStatus('Video loaded successfully! Ready to convert.', 'success');
      } else {
        showStatus(`Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showStatus(`Error analyzing video: ${error.message}`, 'error');
    }
  };

  const handleOutputSelection = async () => {
    const outputPath = await window.electronAPI.selectOutputFolder();
    if (outputPath) {
      setSelectedOutputPath(outputPath);
    }
  };

  const handleConvert = async (options) => {
    setIsConverting(true);
    setConversionComplete(false);
    showStatus('Starting conversion...', 'info');

    try {
      const result = await window.electronAPI.convertVideo(
        selectedVideoPath,
        selectedOutputPath,
        options
      );

      if (result.success) {
        setProgress({
          current: result.data.totalFrames,
          total: result.data.totalFrames,
          percent: 100,
        });
        setConversionComplete(true);
        showStatus('✅ Conversion completed successfully!', 'success');
      } else {
        showStatus(`❌ Conversion failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showStatus(`❌ Error during conversion: ${error.message}`, 'error');
    } finally {
      setIsConverting(false);
    }
  };

  const showStatus = (message, type) => {
    setStatus({ message, type, visible: true });

    if (type !== 'success') {
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, visible: false }));
      }, 5000);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <span className="logo-icon">
            <img src="Image spltter.png" alt="Frame Splitter Logo" />
          </span>
          <h1>Frame Splitter</h1>
        </div>
        <p className="subtitle">Split your videos into high-quality images instantly</p>
      </div>

      <DropZone
        onVideoSelect={handleVideoSelection}
        hasVideo={!!selectedVideoPath}
      />

      <FileInfo videoMetadata={videoMetadata} videoPath={selectedVideoPath} />

      <Controls
        videoMetadata={videoMetadata}
        selectedOutputPath={selectedOutputPath}
        onOutputPathChange={setSelectedOutputPath}
        onSelectOutput={handleOutputSelection}
        onConvert={handleConvert}
        isConverting={isConverting}
        hasVideo={!!selectedVideoPath}
        conversionComplete={conversionComplete}
      />

      <ProgressBar
        progress={progress}
        isVisible={isConverting || progress.percent > 0}
      />

      <StatusMessage status={status} />

      <div className="footer">
        MADE BY <span className="heart">❤️</span> KAIFALI
      </div>
    </div>
  );
}

export default App;

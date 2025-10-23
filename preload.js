const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getDownloadsPath: () => ipcRenderer.invoke('get-downloads-path'),
    selectVideoFile: () => ipcRenderer.invoke('select-video-file'),
    selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
    getVideoInfo: (videoPath) => ipcRenderer.invoke('get-video-info', videoPath),
    convertVideo: (videoPath, outputPath, options) => ipcRenderer.invoke('convert-video', videoPath, outputPath, options),
    handleFileDrop: (filePath) => ipcRenderer.invoke('handle-file-drop', filePath),
    
    // Event listeners
    onConversionProgress: (callback) => {
        ipcRenderer.on('conversion-progress', (event, data) => callback(data));
    },
    
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    }
});
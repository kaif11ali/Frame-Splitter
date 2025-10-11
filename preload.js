const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectVideoFile: () => ipcRenderer.invoke('select-video-file'),
    selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
    getVideoInfo: (videoPath) => ipcRenderer.invoke('get-video-info', videoPath),
    convertVideo: (videoPath, outputPath) => ipcRenderer.invoke('convert-video', videoPath, outputPath),
    handleFileDrop: (filePath) => ipcRenderer.invoke('handle-file-drop', filePath),
    
    // Event listeners
    onConversionProgress: (callback) => {
        ipcRenderer.on('conversion-progress', (event, data) => callback(data));
    },
    
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    }
});
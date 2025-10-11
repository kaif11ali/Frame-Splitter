const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const VideoToFramesConverter = require('./VideoToFramesConverter');

let mainWindow;
let converter;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'icon.png'), // Add an icon if you have one
        title: 'Video to Frames Converter'
    });

    mainWindow.loadFile('renderer.html');
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    converter = new VideoToFramesConverter();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('select-video-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Video Files', extensions: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

ipcMain.handle('select-output-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'createDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

ipcMain.handle('get-video-info', async (event, videoPath) => {
    try {
        const metadata = await converter.getVideoMetadata(videoPath);
        return { success: true, data: metadata };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('convert-video', async (event, videoPath, outputPath) => {
    try {
        // Create a custom converter instance for this conversion to handle progress
        const progressConverter = new VideoToFramesConverter();
        
        // Override the progress tracking
        let progressCallback = null;
        
        const originalExtractFrame = progressConverter.extractFrame;
        progressConverter.extractFrame = async function(videoPath, timestamp, outputPath) {
            const result = await originalExtractFrame.call(this, videoPath, timestamp, outputPath);
            if (progressCallback) {
                progressCallback();
            }
            return result;
        };

        // Set up progress tracking
        let currentFrame = 0;
        progressCallback = () => {
            currentFrame++;
            mainWindow.webContents.send('conversion-progress', {
                current: currentFrame,
                total: 300,
                percent: Math.round((currentFrame / 300) * 100)
            });
        };

        const result = await progressConverter.convertVideo(videoPath, outputPath);
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Handle file drops
ipcMain.handle('handle-file-drop', async (event, filePath) => {
    try {
        const metadata = await converter.getVideoMetadata(filePath);
        return { success: true, data: { filePath, metadata } };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
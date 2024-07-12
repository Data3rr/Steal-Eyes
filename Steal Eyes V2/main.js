// # REQUIREMENTS # //
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
 


// ## ELECTRON ## //
//create main electron window
function createWindow() { 
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'src/style/img/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
  mainWindow.setMenuBarVisibility(false); // hide buttons
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//open file system
ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then(result => {
    event.reply('selected-file', result.filePaths[0]);
  }).catch(err => {
    event.reply('error', err);
  });
});

// ... rest of your main process code ...
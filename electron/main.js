const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { printers } = require('electron');
const os = require('os');


let mainWindow;

function createWindow() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  });

  const iconPath = app.isPackaged 
  ? path.join(__dirname, 'logo.ico') 
  : path.join(__dirname, '../public/logo.ico');

  const preloadScriptPath = app.isPackaged 
  ? path.join(__dirname, 'preload.js') 
  : path.join(__dirname, '../electron/preload.js');

  mainWindow = new BrowserWindow({ 
    width: width, 
    height: height,
    icon: iconPath,
    webPreferences: {
      preload: preloadScriptPath,
      nodeIntegration: true, // Enables require in renderer process
      contextIsolation: false, // Allows renderer and main process communication
      enableRemoteModule: false, // Disable remote module for security reasons
    }, 
    //autoHideMenuBar: false,
  });

  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('print-bill-image', (event, dataUrl) => {
  const printWindow = new BrowserWindow({
    width: 793, // A5 width in pixels
    height: 559, // A5 height in pixels
    show: false, // Hide the window during printing
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
      zoomFactor: 1.0 // Ensure no zooming occurs
    },
  });

  printWindow.loadURL(`data:text/html;charset=utf-8,` + encodeURIComponent(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: start;
            align-items: start;
            height: 100%;
            background-color: #fff;
          }
          img {
            width: 793px; /* Width of A5 */
            height: 559px; /* Height of A5 */
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
      </body>
    </html>
  `));

  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print({ silent: true, deviceName: 'EPSON L3210 Series' }, (success, errorType) => {
      if (!success) console.log(errorType);
      printWindow.close();
    });
  });
});



ipcMain.on('print-result-image', (event, dataUrl) => {
  const printWindow = new BrowserWindow({
    width: 793, // A5 width in pixels
    height: 1123, // A5 height in pixels
    show: false, // Hide the window during printing
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
      zoomFactor: 1.0 // Ensure no zooming occurs
    },
  });

  printWindow.loadURL(`data:text/html;charset=utf-8,` + encodeURIComponent(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: start;
            align-items: start;
            height: 100%;
            background-color: #fff;
          }
          img {
            width: 793px; /* Width of A5 */
            height: 1123px; /* Height of A5 */
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
      </body>
    </html>
  `));

  printWindow.webContents.on('did-finish-load', () => {
    printWindow.webContents.print({ silent: true, deviceName: 'EPSON L3210 Series' }, (success, errorType) => {
      if (!success) console.log('errorrrrr',errorType);
      printWindow.close();
    });
  });
});


ipcMain.handle('get-printers', async () => {
  return await mainWindow.webContents.getPrintersAsync();
});

ipcMain.handle('get-system', async () => {
  return await os.hostname();
});


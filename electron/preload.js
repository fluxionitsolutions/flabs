const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  printBillImage: (dataUrl) => {
    ipcRenderer.send('print-bill-image', dataUrl);
  }
});

contextBridge.exposeInMainWorld('electron', {
  printBillImage: (dataUrl) => {
    ipcRenderer.send('print-result-image', dataUrl);
  }
});

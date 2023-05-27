const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  showContextMenu: async (elementID) => await ipcRenderer.invoke('show-context-menu', elementID),

  on: (channel, callback) => ipcRenderer.on(channel, (event, argv)=>callback(event, argv)),
});


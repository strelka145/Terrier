const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Terrier',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
};

app.once('ready', () => {
  createWindow();
});

app.once('window-all-closed', () => app.quit());

ipcMain.handle('show-context-menu', async (e, elementID) => {
  const menu = Menu.buildFromTemplate([{
    label: 'Add an element forward',
    click: () => {
      mainWindow.webContents.send('addForward', elementID);
    }
  }, {
    label: 'Add an element behind',
    click: () => {
      mainWindow.webContents.send('addBehind', elementID);
    }
  }]);
  menu.popup();
});

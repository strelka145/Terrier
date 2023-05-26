const { app, BrowserWindow, ipcMain, Menu } = require('electron');
let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Terrier',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  mainWindow.loadFile('index.html');
};

app.once('ready', () => {
  createWindow();
});

app.once('window-all-closed', () => app.quit());

ipcMain.on('show-context-menu', (event, elementID) => {
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

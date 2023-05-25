const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Terrier',
  });

  mainWindow.loadFile('index.html');
};

app.once('ready', () => {
  createWindow();
});

app.once('window-all-closed', () => app.quit());

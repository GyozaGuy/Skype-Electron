const AppName = 'Skype';
const height = 650;
const width = 1000;

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = require('menu');
const Tray = require('tray');
const AppIcon = __dirname + '/images/app.png';

// Report crashes to our server.
electron.crashReporter.start();

var mainWindow = null;
var sysTray = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  // Get screen size
  var electronScreen = electron.screen;
  var size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create tray menu
  sysTray = new Tray(AppIcon);
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: function() { mainWindow.focus(); } },
    { label: 'Quit', click: function() { app.quit(); } }
  ]);
  sysTray.setToolTip(AppName);
  sysTray.setContextMenu(contextMenu);

  mainWindow = new BrowserWindow({ icon: AppIcon, width: width, height: height, x: Math.round(size['width'] / 2 - width / 2), y: Math.round(size['height'] / 2 - height / 2) });
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

const AppName = 'Skype';
const height = 650;
const width = 1000;

const electron = require('electron');
const Tray = require('tray');
const Menu = require('menu');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
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

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  if (mainWindow) {
    showAndCenter(mainWindow);
  }
  return true;
});

if (shouldQuit) {
  app.quit();
  return;
}

app.on('ready', function() {
  sysTray = new Tray(AppIcon);
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: function() { showAndCenter(mainWindow); } },
    { label: 'Quit', click: function() { app.quit(); } }
  ]);
  sysTray.setToolTip(AppName);
  sysTray.setContextMenu(contextMenu);

  mainWindow = new BrowserWindow({ icon: AppIcon, width: width, height: height });
  center(mainWindow);
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // NOTE: For links not in a webview?
  // mainWindow.webContents.on('new-window', function(e, url) {
  //   e.preventDefault();
  //   require('shell').openExternal(url);
  // });

  // Open the DevTools
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.closeDevTools();
  // TODO: Fix the above super awful hacky method to get the page to load
  // NOTE: This seems to only be a problem with Skype so far

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.on('minimize', function() {
    mainWindow.hide();
  });
});

function showAndCenter(win) {
  win.show();
  center(win);
  win.focus();
}

function center(win) {
  var electronScreen = electron.screen;
  var size = electronScreen.getPrimaryDisplay().workAreaSize;
  var x = Math.round(size['width'] / 2 - width / 2);
  var y = Math.round(size['height'] / 2 - height / 2);
  win.setPosition(x, y);
}

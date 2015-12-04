'use strict';

const HEIGHT = 650;
const WIDTH = 1000;

const ELECTRON = require('electron');
const PATH = require('path');
const MENU = ELECTRON.Menu;
const TRAY = ELECTRON.Tray;
const APP = ELECTRON.app;
const APPNAME = APP.getName();
const BROWSERWINDOW = ELECTRON.BrowserWindow;
const APPICON = PATH.join(__dirname, 'images', 'app.png');
const IPC = ELECTRON.ipcMain;

ELECTRON.crashReporter.start();

var mainWindow;
var isQuitting = false;

function createMainWindow() {
  const WIN = new ELECTRON.BrowserWindow({
    title: APPNAME,
    show: false,
    height: HEIGHT,
    width: WIDTH,
    icon: APPICON,
    webPreferences: {
      nodeIntegration: false, // fails without this because of CommonJS script detection
      preload: 'file:///' + __dirname + '/js/browser.js' //PATH.join(__dirname, 'js', 'browser.js')
    }
  });

  WIN.loadURL('https://web.skype.com');

  WIN.on('close', e => {
    if (!isQuitting) {
      e.preventDefault();
      WIN.hide();
    }
  });

  return WIN;
}

function showAndCenter(win) {
  center(win);
  win.show();
  win.focus();
}

function center(win) {
  var electronScreen = ELECTRON.screen;
  var size = electronScreen.getPrimaryDisplay().workAreaSize;
  var x = Math.round(size['width'] / 2 - WIDTH / 2);
  var y = Math.round(size['height'] / 2 - HEIGHT / 2);
  win.setPosition(x, y);
}

APP.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    APP.quit();
  }
});

var shouldQuit = APP.makeSingleInstance(function(commandLine, workingDirectory) {
  if (mainWindow) {
    showAndCenter(mainWindow);
  }
  return true;
});

if (shouldQuit) {
  APP.quit();
  return;
}

APP.on('ready', () => {
  var sysTray = new TRAY(APPICON);
  var contextMenu = MENU.buildFromTemplate([
    { label: 'Show', click: function() { showAndCenter(mainWindow); } },
    { label: 'Quit', click: function() { APP.quit(); } }
  ]);
  sysTray.setToolTip(APPNAME);
  sysTray.setContextMenu(contextMenu);

  mainWindow = createMainWindow();

  const PAGE = mainWindow.webContents;

  PAGE.on('dom-ready', () => {
    showAndCenter(mainWindow);
  });

  PAGE.on('new-window', (e, url) => {
    e.preventDefault();
    ELECTRON.shell.openExternal(url);
  });
});

APP.on('activate', () => {
  showAndCenter(mainWindow);
});

APP.on('before-quit', () => {
  isQuitting = true;
});

IPC.on('notification-click', () => {
  showAndCenter(mainWindow);
});

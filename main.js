const electron = require('electron');
const path = require('path');
const {app, Tray, Menu, BrowserWindow, ipcMain, dialog} = electron;
var logger = require(path.resolve(__dirname, "./lib/logger.js"));
const opn = require('opn');

// Explanations how to build an installer
// http://electron.rocks/electron-builder-explained/

// cofiguration
const Config = require('electron-config');
const config = new Config();

const iconPath = path.join(__dirname, './app.png');
const soundPath = path.join(__dirname, './alert.wav');

let appIcon = null;
let alert = null;
let win = null;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

// Global session object
global.sharedObj = {session: {initialized: false}};

app.on('ready', () => {


  logger.log('Config path: ' + app.getPath('userData'));

  // Change notification config options (only works after app is ready)
  alert = require('electron-notify');
  alert.setConfig({
    appIcon: path.join(__dirname, './icon.png'),
    displayTime: 6000
  });

  appIcon = new Tray(iconPath);

  appIcon.on('mouse-enter', () => {
  
  })

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Main Menu',
      click: () => {
        win.loadURL('file://' + __dirname + '/saltoMain.html');
        win.show();
        win.focus();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Initialize',
      click: () => {
        win.loadURL('file://' + __dirname + '/saltoInit.html');
        win.show();
        win.focus();
      }
    },
    {
      label: 'Add services',
      click: () => {
        win.loadURL('file://' + __dirname + '/saltoAddServices.html');
        win.show();
        win.focus();
      }
    },
    {
      label: 'Fetch',
      click: () => {
        win.loadURL('file://' + __dirname + '/saltoFetch.html');
        win.show();
        win.focus();
      }
    },
    {
      label: 'Preview',
      click: () => {
        win.loadURL('file://' + __dirname + '/saltoPreview.html');
        win.show();
        win.focus();
      }
    },
    {
      label: 'Deploy',
      click: () => {
        win.loadURL('file://' + __dirname + '/saltoDeploy.html');
        win.show();
        win.focus();
      }
    },
    {
      label: 'Developer',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: function() { 
            win.show();
            win.toggleDevTools();
          }
        }
      ]
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function() { 
        process.exit();
      }
    }
  ]);

  appIcon.setToolTip('Salto');
  appIcon.setContextMenu(contextMenu);

  // create a new `splash`-Window 
  var splash = new BrowserWindow({width: 484, height: 425, transparent: true, frame: false, alwaysOnTop: true});
  splash.loadURL('file://' + __dirname + '/splash.png');

  return setTimeout(function()  { 
    win = new BrowserWindow({width: 720, height: 400, frame: false, resizable: false})
    win.loadURL('file://' + __dirname + '/saltoMain.html');
    win.show();
    win.focus();
    win.on('blur', () => {
      //win.close();
    })
    win.on('close', (event) => {
      event.preventDefault();
      win.hide();
      alert.notify({ 
        sound: soundPath,
        title: "Salto still active", 
        text: "Salto is still available in your tray" 
      });
    })
    splash.destroy(); 
  }, 3000) 
});

// leave the application open if all windows closed
app.on('window-all-closed', e => e.preventDefault() )

app.on('activate', () => {
  
});

// Listen for async message from renderer process
// Navigate
ipcMain.on('navigate', (event, url) => {
  opn(url);
});

ipcMain.on('saltoHome', (event, url) => {
  let dir = dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  });
  let saltoHome = dir[0];
  config.set('saltoHome', saltoHome);
  win.reload();
});

ipcMain.on('saltoMain', (event) => {
  win.loadURL('file://' + __dirname + '/saltoMain.html');
});

ipcMain.on('saltoInit', (event) => {
  win.loadURL('file://' + __dirname + '/saltoInit.html');
});

ipcMain.on('saltoAddServices', (event) => {
  win.loadURL('file://' + __dirname + '/saltoAddServices.html');
});

ipcMain.on('saltoFetch', (event) => {
  win.loadURL('file://' + __dirname + '/saltoFetch.html');
});

ipcMain.on('saltoPreview', (event) => {
  win.loadURL('file://' + __dirname + '/saltoPreview.html');
});

ipcMain.on('saltoDeploy', (event) => {
  win.loadURL('file://' + __dirname + '/saltoDeploy.html');
});

// notification
ipcMain.on('notification', (event, title, content) => {
  alert.notify({ 
    sound: soundPath,
    title: title, 
    text: content 
  });  
});


////////////////////////////////////////////////////////
// Local attachment gateway

process.on('uncaughtException', function (error) {
  logger.e('EXCEPTION CAUGHT');
  logger.e(error.stack);
});

process.on('unhandledRejection', function (reason, p) {
  logger.e('UNHANDLED PROMISE REJECTION');
  logger.e(reason, p);
});

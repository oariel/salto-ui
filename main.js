const electron = require('electron');
const path = require('path');
const {app, Tray, Menu, BrowserWindow, ipcMain, dialog} = electron;
const electronPrompt = require('electron-prompt');
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

// Find out where Salto is installed
async function getSaltoPath() {
  if ( config.get('saltoPath') )
    return; // already configured

  return new Promise(resolve => {
    require('child_process').exec(`which salto`, function(err, stdout) {
      var str = stdout;
      var saltoPath = str.replace('\n','');
      if ( !saltoPath ) {
        electronPrompt(
          {
            title: 'Salto Configuration',
            label: 'Enter the Salto executable path:',
            value: '',
            inputAttrs: {
                type: 'text',
                required: true
            },
            type: 'input'
        })
        .then((r) => {
          if(r === null) {
              logger.e('User cancelled. Goodbye.');
              process.exit(1);
          } else {
              saltoPath = r;
              logger.log("Salto path: " + saltoPath);
              config.set('saltoPath', saltoPath)
              return resolve(saltoPath);
          }
        })
      }
      else {
        logger.log("Salto path: " + saltoPath);
        config.set('saltoPath', saltoPath);
        return resolve(saltoPath);
      }
    });
  });
}


process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

// Global session object
global.sharedObj = {session: {initialized: false}};

app.on('ready', async () => {


  logger.log('Config path: ' + app.getPath('userData'));
  await getSaltoPath();

  // Change notification config options (only works after app is ready)
  alert = require('electron-notify');
  alert.setConfig({
    appIcon: path.join(__dirname, './icon.png'),
    displayTime: 6000
  });

  appIcon = new Tray(iconPath);

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show window',
      click: () => {
        win.show();
        win.focus();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Main Menu',
      click: () => {
        win.loadURL('file://' + __dirname + '/saltoMain.html');
        win.show();
        win.focus();
      }
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
      type: 'separator'
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

  appIcon.on('mouse-down', () => {
    win.show()
  })

  appIcon.setContextMenu(contextMenu);

  // create a new `splash`-Window 
  var splash = new BrowserWindow({width: 484, height: 425, icon: path.join(__dirname, './icon.png'), transparent: true, frame: false, alwaysOnTop: true});
  splash.loadURL('file://' + __dirname + '/splash.png');

  return setTimeout(function()  { 
    win = new BrowserWindow({width: 720, height: 400, icon: path.join(__dirname, './icon.png'), frame: false, resizable: false})
    win.loadURL('file://' + __dirname + '/saltoMain.html');
    win.show();
    win.focus();
    win.on('blur', () => {
      
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
  const messageBoxOptions = {
    type: "error",
    title: "Oh no.. an error has occurred",
    message: error.message
  };
  dialog.showMessageBox(messageBoxOptions);
  logger.e(error.stack);
});

process.on('unhandledRejection', function (reason, p) {
  logger.e('UNHANDLED PROMISE REJECTION');
  logger.e(reason, p);
});

var path = require('path');

// cofiguration
const Config = require('electron-config');
const config = new Config();

// remoting
const {remote, ipcRenderer} = require('electron');
let mainWindow = remote.require('./main.js');
window.resizeTo(720, 200);

function saltoMain() {
    ipcRenderer.send("saltoMain");    
    return true;
}

function saltoPreview() {
    ipcRenderer.send("saltoPreview");    
    return true;
}

function run() {
    let homeDir = config.get('saltoHome');
    if ( !homeDir )
        return getStatus().innerHTML = "Workspace home directory is not configured.";
    showAnimation();
    runSalto(['fetch'], []);
}



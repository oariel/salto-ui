var path = require('path');

// cofiguration
const Config = require('electron-config');
const config = new Config();

// remoting
const {remote, ipcRenderer} = require('electron');
let mainWindow = remote.require('./main.js');
let homeDir = config.get('saltoHome');
document.getElementById('saltoHome').innerHTML = !homeDir ? "Not set" : homeDir;
window.resizeTo(720, 400);

function privacyPolicy() {
    ipcRenderer.send("navigate", "https://salto.io/privacy.html");    
    return true;
}

function saltoInit() {
    ipcRenderer.send("saltoInit");    
    return true;
}

function saltoHome() {
    ipcRenderer.send("saltoHome");    
    return true;
}

function visitSalto() {
    ipcRenderer.send("navigate", "https://salto.io");    
    return true;
}


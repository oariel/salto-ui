var path = require('path');

// cofiguration
const Config = require('electron-config');
const config = new Config();

// remoting
const {remote, ipcRenderer} = require('electron');
let mainWindow = remote.require('./main.js');

function saltoMain() {
    ipcRenderer.send("saltoMain");    
    return true;
}

function run() {
    showAnimation();
    let homeDir = config.get('saltoHome');
    if ( !homeDir )
        return getStatus().innerHTML = "Workspace home directory is not configured.";
    let workspaceName = document.getElementById("workspace").value;
    if ( !workspaceName )
        return getStatus().innerHTML = "You must provide a workspace name";
    let envName = document.getElementById("environment").value || "env1";
    runSalto(['init', workspaceName], [ {q: "Enter a name for the first environment in the workspace", a: envName} ]);
}



var path = require('path');

// cofiguration
const Config = require('electron-config');
const config = new Config();

// remoting
const {remote, ipcRenderer} = require('electron');
let mainWindow = remote.require('./main.js');
window.resizeTo(720, 450);

function saltoMain() {
    ipcRenderer.send("saltoMain");    
    return true;
}

function run() {
    showAnimation();
    let homeDir = config.get('saltoHome');
    if ( !homeDir )
        return getStatus().innerHTML = "Workspace home directory is not configured.";
    let sel = document.getElementById("application");
    let application = sel.options[sel.selectedIndex].value
    let username = document.getElementById("username").value;
    if ( !username )
        return getStatus().innerHTML = "You must provide a username";
    let password = document.getElementById("password").value;
    if ( !password )
        return getStatus().innerHTML = "You must provide a password";
    let token = document.getElementById("token").value;
    if ( !token )
        return getStatus().innerHTML = "You must provide a token";
    sel = document.getElementById("isSandbox");
    let isSandbox = sel.options[sel.selectedIndex].value;
    var inputs = [
        {q: "Username", a: username},
        {q: "Password", a: password},
        {q: "Token", a: token},
        {q: "Sandbox", a: isSandbox}
    ]
    runSalto(['services', 'add', application], inputs);
}



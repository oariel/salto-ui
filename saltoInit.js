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
    var st = document.getElementById("status");
    var o = document.getElementById("command-output-div");
    st.innerHTML = "Working...";
    if ( o.style.display === "none" ) {
        var img = document.getElementById("working-image");
        var timer = setInterval(function() { 
            img.style.display = "block";
            if ( st.innerHTML !== "Working..." ) {
                img.style.display = "none";
                clearInterval(timer);
            }
        }, 250);
    }
    let homeDir = config.get('saltoHome');
    if ( !homeDir )
        return getStatus().innerHTML = "Workspace home directory is not configured.";
    let workspaceName = document.getElementById("workspace").value;
    if ( !workspaceName )
        return getStatus().innerHTML = "You must provide a workspace name";
    let envName = document.getElementById("environment").value || "env1";
    runSalto(['init', workspaceName], [ {q: "Enter a name for the first environment in the workspace", a: envName} ]);
}

function toggleOutput() {
    var x = document.getElementById("command-output-div");
    if (x.style.display === "none") {
        x.style.display = "block";
        window.resizeBy(0, 200)
    } else {
        x.style.display = "none";
        window.resizeBy(0, -200)
    }
}

function getCommandOutput() { return document.getElementById("command-output");  };

function getStatus() { return document.getElementById("status");  };


var is = require("electron-is");

// Mac and Linux have Bash shell scripts (so the following would work)
//        var child = process.spawn('child', ['-l']);
//        var child = process.spawn('./test.sh');       
// Win10 with WSL (Windows Subsystem for Linux)  https://docs.microsoft.com/en-us/windows/wsl/install-win10
//   
// Win10 with Git-Bash (windows Subsystem for Linux) https://git-scm.com/   https://git-for-windows.github.io/
//

function appendOutput(msg) { getCommandOutput().value += (msg+'\n'); };
function setStatus(msg)    { getStatus().innerHTML = msg; };

function showOS() {
    if (is.windows())
      appendOutput("Windows Detected.")
    if (is.macOS())
      appendOutput("Apple OS Detected.")
    if (is.linux())
      appendOutput("Linux Detected.")
}

function runSalto(args, responses) {

    var count = 0;

    const process = require('child_process');   

    showOS();

    var homeDir = config.get('saltoHome');

    appendOutput("Home directory: " + homeDir);
        
    var child = process.spawn('salto', args, {cwd: homeDir}); 

    child.on('error', function(err) {
        appendOutput('stderr: <'+err+'>' );
    });

    child.stdout.on('data', function (data) {
        appendOutput(data);
        if ( count < responses.length && data.indexOf(responses[count].q) !== -1 ) {
            child.stdin.write(responses[count].a);
            child.stdin.end();
            count++;
        }
    });

    child.stderr.on('data', function (data) {
      appendOutput('stderr: <'+data+'>' );
    });

    child.on('close', function (code) {
        if (code == 0)
          setStatus('Salto completed.');
        else
          setStatus('Salto exited with code ' + code);

        getCommandOutput().style.background = "LightGray";
    });
};

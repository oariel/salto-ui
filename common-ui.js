function showAnimation() {
    var st = document.getElementById("status");
    var c = document.getElementById("command-output");
    var o = document.getElementById("command-output-div");
    st.innerHTML = "Working...";
    if ( o.style.display === "none" ) {
        var img = document.getElementById("working-image");
        var tb = document.getElementById("toggle-button");
        var timer = setInterval(function() { 
            img.style.display = "block";
            if ( st.innerHTML !== "Working..." ) {
                img.style.display = "none";
                clearInterval(timer);
            }
           if ( c.value )
            tb.disabled = false;
        }, 250);
    }
}

function toggleOutput() {
    var x = document.getElementById("command-output-div");
    if (x.style.display === "none") {
        x.style.display = "block";
        window.resizeTo(720, 600)
    } else {
        x.style.display = "none";
        window.resizeTo(720, 400)
    }
}

function getCommandOutput() { return document.getElementById("command-output");  };
function getStatus() { return document.getElementById("status");  };
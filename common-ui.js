const WORKING_INDICATOR = "Working...";

function showAnimation() {
    var st = document.getElementById("status");
    var c = document.getElementById("command-output");
    var o = document.getElementById("command-output-div");
    var img = document.getElementById("working-image");

    st.innerHTML = WORKING_INDICATOR;
    img.style.display = "block";
    if ( o.style.display === "none" ) {
        var tb = document.getElementById("toggle-button");
        var timer = setInterval(function() { 
            if ( st.innerHTML !== WORKING_INDICATOR ) {
                img.style.display = "none";
                clearInterval(timer);
            }
           if ( c.value )
            tb.disabled = false;
        }, 250);
    }
}

function toggleOutput() {
    var st = document.getElementById("status");
    let isWorking = (st.innerHTML === WORKING_INDICATOR);
    var c = document.getElementById("command-output-div");
    var img = document.getElementById("working-image");
    if (c.style.display === "none") {
        img.style.display = "none";
        c.style.display = "block";
        window.resizeBy(0, 200)
    } 
    else {
        c.style.display = "none";
        if ( isWorking )
            img.style.display = "block";
        window.resizeBy(0, -200)
    }
}

function getCommandOutput() { return document.getElementById("command-output");  };
function getStatus() { return document.getElementById("status");  };
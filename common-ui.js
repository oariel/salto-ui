const WORKING_INDICATOR = "Salto is working...";
const COMPLETE_INDICATOR = "Salto completed.";

function showAnimation() {
    var st = document.getElementById("status");
    var c = document.getElementById("command-output");
    var img = document.getElementById("working-image");
    var rb = document.getElementById("run-button");
    var ns = document.getElementById("next-step");

    st.innerHTML = WORKING_INDICATOR;
    if ( c.style.display === "none" ) {
        img.style.display = "inline";
        rb.disabled = true;
        var tb = document.getElementById("toggle-button");
        var timer = setInterval(function() { 
            if ( st.innerHTML !== WORKING_INDICATOR ) {
                img.style.display = "none";
                rb.disabled = false;
                if ( ns && st.innerHTML === COMPLETE_INDICATOR ) {
                    st.style.display = "none";
                    ns.style.display = "block";
                }    
                clearInterval(timer);
            }
            if ( c.value )
                tb.style.display = "block";
        }, 250);
    }
}

function toggleOutput() {
    var st = document.getElementById("status");
    let isWorking = (st.innerHTML === WORKING_INDICATOR);
    var c = document.getElementById("command-output");
    var img = document.getElementById("working-image");
    if (c.style.display === "none") {
        img.style.display = "none";
        c.style.display = "block";
        window.resizeBy(0, 320)
    } 
    else {
        c.style.display = "none";
        if ( isWorking )
            img.style.display = "block";
        window.resizeBy(0, -320)
    }
}

function getCommandOutput() { return document.getElementById("command-output");  };
function getStatus() { return document.getElementById("status");  };
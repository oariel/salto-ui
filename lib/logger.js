var prettyjson = require('prettyjson');

Object.defineProperty(global, '__stack', {
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error();
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
    get: function() {
        return __stack[3].getLineNumber();
    }
});

Object.defineProperty(global, '__file', {
    get: function() {
        return __stack[3].getFileName();
    }
});

Object.defineProperty(global, '__function', {
    get: function() {
        return __stack[3].getFunctionName();
    }
});

function digits(s) {
    os = '';
    if (s < 10) os += '0';
    os += s.toString();
    return os;
}


function format(s, t) {

    var l = __line;
    var f = __function;
    var file = __file.match(/([^\/]*)\/*$/)[1];
    // f = __function + ':' + __file + ':' +  __line;
    if (typeof s == 'undefined') s = '';
    var ss = s;
    if (typeof s == 'object') {
        ss = "\n" + JSON.stringify(s, null, 2);
    } else if (typeof s == 'function') {
        ss = 'function';
    }

    var now = new Date();

    var ds = now.getUTCFullYear().toString() +
        '-' +
        digits(now.getUTCMonth() + 1) +
        '-' +
        now.getUTCDate().toString() + 'T' +
        digits(now.getUTCHours()) + ':' +
        digits(now.getUTCMinutes()) + ':' +
        digits(now.getUTCSeconds());

    var os = ds +
        ' | ' +
        t +
        ' | ' +
        file + ':' + l +
        ' | ' +
        ss;

    return os;
}

function print_object(obj, pretty = true) {
    if ( pretty ) {
        var options = {
            defaultIndentation: 3,
            dashColor: "yellow"
        };    
        console.log( prettyjson.render(obj, options) );
    }
    else
        console.log( JSON.stringify(obj, null, 4)  );
}

function log(s) {
    console.log(format(s, '   '));
}

function warn(s) {
    console.log(format(s, 'wrn'));
}

function error(s) {
    console.log(format(s, 'ERR'));
}

function critical(s) {
    console.log(format(s, '!E!'));
}

function debug(s) {
    console.log(format(s, 'dbg'));
}

function lastGitHash() {
    return new Promise(resolve => {
        require('child_process').exec('git show -s --format=\'Last commit hash is %H by %cn on %ci: "%s"\'', function(err, stdout) {
            var str = stdout;
            resolve(str.replace('\n',''));
        });
    });
}

function getSourceIP() {
    return new Promise(resolve => {
        require('child_process').exec('curl canhazip.com', function(err, stdout) {
            var str = stdout;
            resolve(str.replace('\n',''));
        });
    });
}

function last_commit_hash() {
    var hash = await lastGitHash();
    debug(hash);
}

function print_source_ip() {
    var sourceIP = await getSourceIP();
    debug("Source IP: " + sourceIP);
}


module.exports.print_object = print_object;
module.exports.log = log;
module.exports.l = log;
module.exports.warn = warn;
module.exports.w = warn;
module.exports.err = error;
module.exports.e = error;
module.exports.crit = critical;
module.exports.c = critical;
module.exports.debug = debug;
module.exports.d = debug;
module.exports.last_commit_hash = last_commit_hash;
module.exports.print_source_ip = print_source_ip;
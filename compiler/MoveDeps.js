
var fs = require('fs');

function copyDirSync(src, dest) {
    var files = fs.readdirSync(src);
    for (var i = 0; i < files.length; i++) {
        var s = src + '/' + files[i];
        var d = dest + '/' + files[i];
        if (isDir(s)) {
            fs.mkdirSync(d);
            copyDirSync(s, d);
            continue;
        }
        fs.writeFileSync(d, fs.readFileSync(s));
    }
    function isDir(path){  
        return fs.statSync(path).isDirectory();  
    }
}

function MoveDeps(options) {
    AbstractProcessor.call(this, options);
}

MoveDeps.prototype = new AbstractProcessor();

MoveDeps.prototype.name = 'MoveDeps';

MoveDeps.prototype.process = function (file, processContext, callback) {
    fs.mkdirSync('./build');
    fs.mkdirSync('./build/deps');
    copyDirSync('./deps', './build/deps');
    callback();
};

module.exports = MoveDeps;
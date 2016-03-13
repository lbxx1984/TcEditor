
var fs = require('fs');

function MergeDeps(options) {
    AbstractProcessor.call(this, options);
}

MergeDeps.prototype = new AbstractProcessor();

MergeDeps.prototype.name = 'MergeDeps';

MergeDeps.prototype.process = function (file, processContext, callback) {
    fs.mkdirSync('./build');
    fs.mkdirSync('./build/dep');
    var date = new Date();
    var timer = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    ].join('-');
    var code = file.data;
    var store = [];
    var scripts = [];
    var left = '<script type="text/javascript" src="';
    var right = '"></script>';
    var begin = -1;
    var end = 0;
    begin = code.indexOf(left, end);
    while(begin > -1) {
        end = code.indexOf(right, begin);
        if (end < 0) break;
        var script = code.substr(begin, end + right.length - begin);
        scripts.push(script);
        store.push(fs.readFileSync('./' + script.replace(left, '').replace(right, '')));
        begin = code.indexOf(left, end);
    }
    if (store.length > 0) {
        var dep = store.join('\n').replace(/use strict/g, '')
        fs.writeFileSync('./build/dep/dep.js', dep);
    }
    while(scripts.length > 0) {
        var script = scripts.pop();
        var replace = scripts.length === 0
            ? '<script type="text/javascript" src="./dep/dep.js"></script>\n'
                + '<script type="text/javascript" src="./src/main.js?v=' + timer + '"></script>'
            : '';
        code = code.replace(script, replace);
    }
    code = code.replace(/\.js"/g, '\.js?v=' + timer + '"')
        .replace(/\.css"/g, '.css?v=' + timer + '"');
    file.setData(code);
    callback();
};

module.exports = MergeDeps;

var fs = require('fs');

function EncodeTTF(options) {
    AbstractProcessor.call(this, options);
}

EncodeTTF.prototype = new AbstractProcessor();

EncodeTTF.prototype.name = 'EncodeTTF';

EncodeTTF.prototype.process = function (file, processContext, callback) {
    var ttf = fs.readFileSync('./css/iconfont/iconfont.ttf').toString('base64');
    ttf = 'data:application/x-font-ttf;charset=utf-8;base64,' + ttf;
    file.setData(file.data.replace('\'iconfont/iconfont.ttf\'', ttf));
    console.log(file);
    callback();
};

module.exports = EncodeTTF;
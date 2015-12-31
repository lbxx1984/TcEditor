/**
 * 纯Promise异步IO操作接口
 */
define(function (require) {

    var Dialog = require('uiTool/dialog');
    var saver = require('./util/FileSaver');

    // loader引擎集合，一部分loader以文件类型为名称，一部分以功能为名称
    var loaders = {
        conf: require('./loader/confLoader'),
        tcm: require('./loader/tcmLoader')
    };

    // exporter引擎集合，理论上每个loader都有一个同名的exporter与之对应
    var exporters = {
        conf: require('./exporter/confExporter'),
        tcm: require('./exporter/tcmExporter')
    };

    /**
     * IO系统，负责保存打开所有文件，以及文件解析
     * IO系统所有接口返回Promise异步对象
     *
     * @param {Object} param 配置参数
     * @param {Object} param.routing 全局控制路由
     */
    function IO(param) {
        this.routing = param.routing;
    }

    /**
     * 读取本地文件
     */
    IO.prototype.readFile = function (path, type) {
        var types = ['readAsBinaryString', 'readAsText', 'readAsDataURL', 'readAsArrayBuffer'];
        var fs = this.routing.fs;
        type = types.indexOf(type) < 0 ? 'readAsText' : type;
        return new Promise(function (resolve, reject) {
            fs.read(path, gotFile, {type: type});
            function gotFile(evt) {
                if (evt instanceof FileError) {
                    reject();
                }
                else {
                    resolve(evt.target.result)
                }
            }
        });
    };

    /**
     * 写入本地文件
     */
    IO.prototype.writeFile = function (path, blob) {
        var fs = this.routing.fs;
        return new Promise(function (resolve, reject) {
            fs.write(path, {data: blob}, function (result) {
                if (result instanceof FileError) {
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    };

    /**
     * 异步调用各种loader
     */
    IO.prototype.callLoader = function (loader, data) {
        var routing = this.routing;
        return new Promise(function (resolve, reject) {
            if (loaders.hasOwnProperty(loader) && typeof loaders[loader] === 'function') {
                loaders[loader].apply(routing, [data, callback]);
            }
            else {
                reject('Unable to parse ' + loader.toUpperCase() + ' file.');
            }
            function callback(evt) {
                if (!evt) {
                    reject('fail to parse.');
                }
                else {
                    resolve();
                }
            }
        });
    };

    /**
     * 异步调用各种exporter
     */
    IO.prototype.callExporter = function (exporter) {
        var routing = this.routing;
        return new Promise(function (resolve, reject) {
            if (exporters.hasOwnProperty(exporter) && typeof exporters[exporter] === 'function') {
                var result = exporters[exporter].apply(routing, [callback]);
                if (result) {
                    resolve(result);
                }
            }
            else {
                reject();
            }
            function callback(e) {
                !e ? reject() : resolve(e);
            }
        });
    };

    /**
     * 打开文件选择器
     *
     * @param {string} mode explorer工作模式: Open, Save
     * @param {string} filetype 保存时自动添加的文件扩展名
     */
    IO.prototype.openExplorer = function (mode, filetype) {
        var hotkey = '|backspace|enter|esc|';
        var me = this.routing;
        return new Promise(function (resolve, reject) {
            var dialog = new Dialog({
                onClose: function () {
                    me.keyboard.removeListener(hotkey);
                    reject(true);
                }
            });
            me.keyboard.addListener(hotkey, function (e) {
                switch (e) {
                    case 'backspace': dialog.ui.content.upClickHandler(); break;
                    case 'enter': dialog.ui.content.enterClickHandler(); break;
                    case 'esc': dialog.close(); reject(true); break;
                    default: break;
                }
            });
            dialog.pop({
                title: mode,
                content: require('component/explorer.jsx'),
                focus: 'inputbox',
                props: {
                    fs: me.fs,
                    mode: mode.toLowerCase(),
                    button1: mode,
                    filetype: filetype,
                    onEnter: function (path) {
                        resolve(path);
                        me.keyboard.removeListener(hotkey);
                        dialog.close(false);
                    }
                }
            });
        });
    };

    /**
     * 打开浏览器的upload窗口上传本地文件
     */
    IO.prototype.upload = function () {
        var inputDOM = this.routing.ui.refs.importdoor.getDOMNode();
        return new Promise(function (resolve, reject) {
            inputDOM.onchange = function (evt) {
                var file = evt.target.files[0];
                var reader = new FileReader();
                reader.onload = function() {
                    evt.target.onchange = null;
                    evt.target.value = '';
                    resolve({
                        name: file.name,
                        blob: this.result
                    });
                }
                reader.onerror = function (e) {
                    reject(e);
                }
                reader.readAsArrayBuffer(file);
            };
            inputDOM.click();
        });
    };

    /**
     * 推送文件加载到本地
     */
    IO.prototype.download = function (blob, filename) {
        saver(blob, filename);
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };

    return IO;
});

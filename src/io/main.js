/**
 * 纯Promise异步IO操作接口
 */
define(function (require) {

    // var exporter = require('./translator/exporter');
    // var importer = require('./translator/importer');
    // var compressor = require('./util/compressor');
    // var tcmLoader = require('./loader/tcmLoader');
    // var Zip = require('./util/jszip');
    var Dialog = require('uiTool/dialog');

    // loader引擎集合，一部分loader以文件类型为名称，一部分以功能为名称
    var loaders = {
        conf: require('./loader/confLoader')
    };

    // exporter引擎集合，理论上每个loader都有一个同名的exporter与之对应
    var exporters = {
        conf: require('./exporter/confExporter')
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
                reject();
            }
            function callback(evt) {
                resolve();
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
                var result = exporters[exporter].apply(routing, []);
                resolve(result);
            }
            else {
                reject();
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
                    reject();
                }
            });
            me.keyboard.addListener(hotkey, function (e) {
                switch (e) {
                    case 'backspace': dialog.ui.content.upClickHandler(); break;
                    case 'enter': dialog.ui.content.enterClickHandler(); break;
                    case 'esc': dialog.close(); reject(); break;
                    default: break;
                }
            });
            dialog.pop({
                title: mode,
                content: require('component/explorer.jsx'),
                focus: 'inputbox',
                props: {
                    fs: me.fs,
                    mode: mode,
                    button1: mode,
                    filetype: filetype,
                    onEnter: function (path) {
                        resolve(path);
                        dialog.close(false);
                    }
                }
            });
        });
    };



    /**
     * 从本地读取TCM文件并导入舞台
     *
     * @param {string} path 文件的绝对路径
     * @param {function} callback 回调函数 
     */
    /*
    IO.prototype.readTCM = function (path, callback) {
        var me = this.routing;
        me.fs.read(path, gotFile, {type: ''});
        // 解析TCM文件
        function gotFile(result) {
            if (!(result instanceof ProgressEvent)) return;
            try {
                var zip = new Zip(result.target.result);
                if (!zip.files['.content']) {
                    callback('fail to open file.');
                    return;
                }
                var textures = [];
                for (var url in zip.files) {
                    if (url.indexOf('.texture/') !== 0) continue;
                    textures.push(url);
                }
                loadTexture(zip, textures, function () {
                    var content = JSON.parse(zip.files['.content'].asText());
                    loadContent(content);
                });
            }
            catch (e) {
                callback('fail to open file.');
            }
        }
        // 载入模型
        function loadContent(content) {
            // TODO: 检测上一个文件保存状态
            if (content.hasOwnProperty('lights') && content.lights instanceof Array && content.lights.length > 0) {
                tcmLoader.light(me, content.lights);
            }
            if (content.hasOwnProperty('camera')) {
                importer.camera(me, content.camera);
            }
            if (content.hasOwnProperty('groups') && content.groups instanceof Array) {
                me.ui.refs.containerright.refs.verticallist.refs.meshBox.setState({group: content.groups});
            }
            if (content.hasOwnProperty('meshes') && content.meshes instanceof Array && content.meshes.length > 0) {
                tcmLoader.mesh(me, content.meshes);
            }
            if (typeof callback === 'function') callback();
        }
        // 载入纹理，将纹理存储到本地文件系统中
        function loadTexture(zip, textures, callback) {
            if (textures.length === 0) {
                callback();
                return;
            }
            var url = textures.pop();
            var filePath = '/' + window.editorKey + '/' + url;
            me.fs.md('/' + window.editorKey + '/.texture', writeTexture);
            function writeTexture() {
                me.fs.write(filePath, {}, function (e) {
                    var writer = e.target;
                    writer.onwriteend = function (e) {
                        loadTexture(zip, textures, callback);
                    };
                    writer.onerror = function (e) { 
                        loadTexture(zip, textures, callback);
                    };
                    writer.write(new Blob([zip.files[url].asArrayBuffer()]));
                });
            }
        }
    };
*/

    /**
     * 向本地写入TCM文件
     *
     * @param {string} path 文件的绝对路径
     * @param {function} callback 回调函数 
     * @param {?boolean} savefile 是否推送文件下载
     */
     /*
    IO.prototype.writeTCM = function (path, callback, savefile) {
        var me = this.routing;
        var zip = new Zip();
        var textures = [];
        var content = {};
        content.meshes = [];
        content.lights = [];
        content.groups = [];

        // 导出摄像机
        content.camera = exporter.camera(me.stage);
        // 导出物体
        for (var key in me.stage.$3d.children) {
            var geo = me.stage.$3d.children[key];
            var mesh = exporter.mesh(geo);
            compressor(mesh, 2);
            content.meshes.push(mesh);
            if (geo.material.map && geo.material.map.image && geo.material.map.image.path) {
                textures.push(geo.material.map.image.path);
            }
        }
        // 导出灯光
        for (var key in me.light.children) {
            var light = exporter.light(me.light.children[key]);
            compressor(light, 2);
            content.lights.push(light);
        }
        // 导出分组
        var groups = JSON.stringify(me.ui.refs.containerright.refs.verticallist.refs.meshBox.state.group);
        content.groups = JSON.parse(groups);
        for (var i = 0; i < content.groups.length; i++) {
            delete content.groups[i].children;
        }

        // 写入模型文件
        zip.file('.content', JSON.stringify(content));
        // 写入纹理文件
        zipTextures();
        function zipTextures() {
            if (textures.length === 0) {
                writeFile();
                return;
            }
            var path = textures.pop();
            var fileName = path.split('/').pop();
            me.fs.read(path, function (e) {
                if (e instanceof FileError) {
                    zipTextures();
                    return;
                }
                zip.file('.texture/' + fileName, e.target.result);
                zipTextures();
            }, {type: 'readAsArrayBuffer'});
        }
        function writeFile() {
            if (savefile) {
                saveAs(zip.generate({type: 'blob'}), path.split('/').pop());
            }
            else {
                me.fs.write(path, {data: zip.generate({type: 'blob'})}, function (result) {
                    if (typeof callback === 'function') callback();
                });
            }
        }
    };
*/

    return IO;
});

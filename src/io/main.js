define(function (require) {


    var config = require('config'); 
    var exporter = require('./exporter');
    var importer = require('./importer');
    var compressor = require('./compressor');
    var tcmLoader = require('./tcmLoader');
    var Zip = require('./jszip');


    /**
     * io系统，负责保存打开所有文件，以及文件解析
     *
     * @param {Object} param 配置参数
     * @param {Object} param.routing 全局控制路由
     */
    function IO(param) {
        this.routing = param.routing;
    }


    /**
     * 从本地读取TCM文件并导入舞台
     *
     * @param {string} path 文件的绝对路径
     * @param {function} callback 回调函数 
     */
    IO.prototype.readTCM = function (path, callback) {
        var me = this.routing;
        me.fs.read(path, gotFile, {type: 'readAsArrayBuffer'});
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


    /**
     * 向本地写入TCM文件
     *
     * @param {string} path 文件的绝对路径
     * @param {function} callback 回调函数 
     * @param {?boolean} savefile 是否推送文件下载
     */
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


    /**
     * 从本地读取编辑器配置并导入，如果本地配置出错则导入默认配置
     *
     * @param {function} callback 导入完成后的回调
     */
    IO.prototype.readEditorConf = function (callback) {
        var me = this.routing;
        var path = '/' + window.editorKey + '/' + window.editorKey + 'conf';
        me.fs.read(path, function (result) {
            var conf = config.editorDefaultConf;
            if (!(result instanceof FileError)) {
                try {
                    conf = JSON.parse(result.target.result);
                }
                catch (e) {}
            }
            try {
                importer.editorConf(me, conf);
            }
            catch (e) {}
            if (typeof callback === 'function') callback();
        });
    };


    /**
     * 将编辑器配置写入本地
     *
     * @param {function} callback 写入完成后的回调
     */
    IO.prototype.writeEditorConf = function (callback) {
        var me = this.routing;
        var confPath = '/' + window.editorKey + '/' + window.editorKey + 'conf';
        var confContent = new Blob([JSON.stringify(exporter.editorConf(this.routing))]);
        me.fs.write(confPath, {data: confContent}, function (result) {
            if (typeof callback === 'function') callback(result);
        });
    };


    return IO;
});

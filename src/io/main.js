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
        function loadFile(content) {
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
        function gotFile(result) {
            if (!(result instanceof ProgressEvent)) return;
            try {
                var zip = new Zip(result.target.result);
                var content = zip.file('.content').asText();
                content = JSON.parse(content);
                loadFile(content);
            }
            catch (e) {
                callback('fail to open file.');
            }
        }
    };


    /**
     * 向本地写入TCM文件
     *
     * @param {string} path 文件的绝对路径
     * @param {function} callback 回调函数 
     */
    IO.prototype.writeTCM = function (path, callback) {
        var me = this.routing;
        var content = {};
        var textures = [];
        content.meshes = [];
        content.lights = [];
        content.camera = exporter.camera(me.stage);
        content.groups = [];
        // 导出图片的base64数据
        for (var key in me.stage.$3d.children) {
            var material = me.stage.$3d.children[key].material;
            if (!material.map) continue;
            var url = material.map.image.url || material.map.uuid;
            var image = exporter.getDataURL(material.map.image, url);
            textures.push({url: url, image: image});
        }
        // 导出物体
        for (var key in me.stage.$3d.children) {
            var mesh = exporter.mesh(me.stage.$3d.children[key]);
            compressor(mesh, 2);
            content.meshes.push(mesh);
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
        var zip = new Zip();
        zip.file('.content', JSON.stringify(content));
        // 写入纹理文件
        if (textures.length > 0) {
            zip.folder('.texture');
            for (var i = 0; i < textures.length; i++) {
                zip.file('.texture/' + textures[i].url, textures[i].image, {base64: true});
            }
        }
        // 存储到本地
        me.fs.write(path, {data: zip.generate({type: 'blob'})}, function (result) {
            if (typeof callback === 'function') {
                callback(result);
            }
        });
        saveAs(zip.generate({type: 'blob'}), path.split('/').pop());
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

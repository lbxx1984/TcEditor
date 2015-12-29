/**
 * 负责将tcm文件导入到舞台
 */
define(function (require) {


    var object2three = require('../util/object2three');
    var Zip = require('../util/jszip');


    // 装载灯光，此方法为同步执行
    function parseLight(me, lights) {
        me.light.removeAll();
        for (var i = 0; i < lights.length; i++) {
            var light = object2three.light(lights[i]);
            me.light.add(light);
        }
        showLight();
        function showLight() {
            if (me.ui == null) {
                setTimeout(showLight, 10);
            }
            else {
                me.ui.refs.containerright.refs.verticallist.refs.lightBox.setState({light: me.light.children});
            }
        }
    }


    // 导入摄像机配置，此方法为同步
    function parseCamera(me, conf) {
        var stage2d = me.stage.$2d;
        var stage3d = me.stage.$3d;
        var cameraController = me.stage.cameraController;
        cameraController.param.cameraAngleA = conf.a;
        cameraController.param.cameraAngleB = conf.b;
        cameraController.updateCameraPosition();
        stage2d.param.scale = conf.s;
        stage2d.param.cameraLookAt = {x: conf.o[0], y: conf.o[1]};
        stage3d.param.cameraRadius = conf.r;
        stage3d.param.cameraAngleA = conf.a;
        stage3d.param.cameraAngleB = conf.b;
        stage3d.param.cameraLookAt = {x: conf.l[0], y: conf.l[1], z: conf.l[2]};
        stage3d.updateCameraPosition();
    }


    // 导入物体，此方法为同步
    function parseMesh(me, meshes) {
        me.stage.removeAll();
        for (var i = 0; i < meshes.length; i++) {
            var mesh = object2three.mesh(meshes[i], me);
            if (mesh != null) {
                me.stage.add(mesh);
            }
        }
        showMeshes();
        function showMeshes() {
            if (me.ui == null) {
                setTimeout(showMeshes, 10);
                return;
            }
            me.ui.refs.containerright.refs.verticallist.refs.meshBox.setState({
                meshes: me.stage.$3d.children
            });
            if (me.stage.type !== '$3d') {
                me.stage.$2d.loadMesh();
                me.stage.$2d.renderMesh();
            }
        }
    }


    // 载入纹理，将纹理存储到本地文件系统中，此方法为异步
    function loadTexture(zip, textures, callback) {
        if (textures.length === 0) {
            callback();
            return;
        }
        var me = this;
        var url = textures.pop();
        var filePath = '/' + window.editorKey + '/' + url;
        me.fs.md('/' + window.editorKey + '/.texture', writeTexture);
        function writeTexture() {
            me.fs.write(filePath, {}, function (e) {
                var writer = e.target;
                var blob = new Blob([zip.files[url].asArrayBuffer()]);
                writer.onwriteend = function (e) {
                    loadTexture.apply(me, [zip, textures, callback]);
                };
                writer.onerror = function (e) { 
                    loadTexture.apply(me, [zip, textures, callback]);
                };
                writer.write(blob);
            });
        }
    }


    // 载入模型，此方法为同步
    function loadContent(content) {
        var me = this;
        if (content.hasOwnProperty('lights') && content.lights instanceof Array && content.lights.length > 0) {
            parseLight(me, content.lights);
        }
        if (content.hasOwnProperty('camera')) {
            parseCamera(me, content.camera);
        }
        if (content.hasOwnProperty('groups') && content.groups instanceof Array) {
            me.ui.refs.containerright.refs.verticallist.refs.meshBox.setState({group: content.groups});
        }
        if (content.hasOwnProperty('meshes') && content.meshes instanceof Array && content.meshes.length > 0) {
            parseMesh(me, content.meshes);
        }
    }


    // loader接口
    function loader(data, callback) {
        var me = this;
        try {
            var zip = new Zip(data);
            if (!zip.files['.content']) {
                callback(false);
                return;
            }
            var textures = [];
            for (var url in zip.files) {
                if (url.indexOf('.texture/') !== 0) continue;
                textures.push(url);
            }
            loadTexture.apply(me, [zip, textures, loadTextureOver]);
            callback(true);
        }
        catch (e) {
            callback(false);
        }
        function loadTextureOver() {
            var content = JSON.parse(zip.files['.content'].asText());
            loadContent.apply(me, [content]);
        }
    }


    return loader;
});

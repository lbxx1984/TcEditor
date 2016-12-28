/**
 * 导出舞台中所有为tcm压缩包
 */
define(function (require) {

    var Zip = require('../util/jszip');
    var three2object = require('../util/three2object');
    var compressor = require('../util/compressor');

    function exporter(callback) {

        var me = this;
        var zip = new Zip();
        var textures = [];
        var content = {};
        content.meshes = [];
        content.lights = [];
        content.groups = [];

        // 导出摄像机
        content.camera = three2object.camera(me.stage);

        // 导出分组
        content.groups = JSON.stringify(me.ui.refs.containerright.refs.verticallist.refs.meshBox.state.group);
        content.groups = JSON.parse(content.groups);
        for (var i = 0; i < content.groups.length; i++) {
            delete content.groups[i].children;
        }

        // 导出物体
        for (var key in me.stage.$3d.children) {
            var geo = me.stage.$3d.children[key];
            var mesh = three2object.mesh(geo);
            compressor(mesh, 2);
            content.meshes.push(mesh);
            if (geo.material.map && geo.material.map.image && geo.material.map.image.path) {
                textures.push(geo.material.map.image.path);
            }
        }

        // 导出灯光
        for (var key in me.light.children) {
            var light = three2object.light(me.light.children[key]);
            compressor(light, 2);
            content.lights.push(light);
        }

        // 写入纹理文件并返回zip blob
        zipTextures();

        function zipTextures() {
            if (textures.length === 0) {
                zip.file('.content', JSON.stringify(content));
                callback(zip.generate({type: 'blob'}));
                return;
            }
            var path = textures.pop();
            var fileName = path.split('/').pop();
            me.fs.read(path, function (e) {
                if (e && e.target && e.target.result) {
                    zip.file('.texture/' + fileName, e.target.result);
                    zipTextures();
                }
                else {
                    zipTextures();
                }
            }, {type: 'readAsArrayBuffer'});
        }
        
        // saveAs(zip.generate({type: 'blob'}), path.split('/').pop());
    }

    return exporter;
});

/**
 * 负责将tcm文件导入到舞台
 */
define(function (require) {

    var importer = require('./importer');

    return {
        light: function (me, lights) {
            me.light.removeAll();
            for (var i = 0; i < lights.length; i++) {
                var light = importer.light(lights[i]);
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
        },
        mesh: function (me, meshes) {
            me.stage.removeAll();
            for (var i = 0; i < meshes.length; i++) {
                var mesh = importer.mesh(meshes[i]);
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
    };
});

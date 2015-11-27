define(function (require) {

    var common = require('./common');

    return {
        loaded: function () {
            common._down = false;
            common.updateControlBar(this, 'enablebar', 'transformer|');
            if (common._lastMesh && this.stage.$3d.children[common._lastMesh.uuid]) {
                common.attach(this, 'transformer', common._lastMesh);
            }
            else {
                common._lastMesh = null;
            }
            common.updateControlBar(this, 'systemtool', 'pickgeo');
        },
        mouseRightClick: function (e) {
            common._down = false;
            this.stage.changeMeshColor(null, 'active');
            if (this.transformer.attached) {
                common.detach(this, 'transformer');
            }
        },
        mousemove: function (e) {
            if (!common._down) {
                var mesh = this.stage.getMeshByMouse(e);
                if (
                    mesh == null
                    || (mesh != null && !this.stage.activeMesh[mesh.uuid] && !this.transformer.attached)
                ) {
                    this.stage.changeMeshColor(mesh, 'hover');
                }
                return;
            }
            var mouse3d = this.stage.getMouse3D(e);
            this.transformer.$2d.dragging(
                [e.clientX - common._mouse[0], e.clientY - common._mouse[1]],
                [mouse3d.x - common._mouse3d[0], mouse3d.y - common._mouse3d[1], mouse3d.z - common._mouse3d[2]]
            );
            common._mouse = [e.clientX, e.clientY];
            common._mouse3d = [mouse3d.x, mouse3d.y, mouse3d.z];
        },
        mouseup: function (e) {
            common._down = false;
            this.transformer.$2d.command = null;
        },
        mousedown: function (e) {
            // 右键返回
            if (e.button === 2) return;
            common._down = true;
            var mouse3d = this.stage.getMouse3D(e);
            common._mouse3d = [mouse3d.x, mouse3d.y, mouse3d.z];
            common._mouse = [e.clientX, e.clientY];
            var mesh = this.stage.getMeshByMouse(e);
            if (mesh == null) return;
            common.attach(this, 'transformer', mesh);
        },
        unload: function () {
            common._down = false;
            common._lastMesh = this.transformer.mesh;
            common.detach(this, 'transformer');
            common.updateControlBar(this, 'enablebar', '');
        }
    };
});

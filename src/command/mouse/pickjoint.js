define(function (require) {

    var common = require('./common');

    function attachJoint(me, joint) {
        var leftContainer = me.ui.refs.containerleft;
        leftContainer.refs.stage.setState({activeJoint: joint});
        me.morpher.attachJoint(joint);
    }

    function detachJoint(me) {
        var leftContainer = me.ui.refs.containerleft;
        leftContainer.refs.stage.setState({activeJoint: null});
        me.morpher.detachJoint();
    }

    return {
        loaded: function (e) {
            common._down = false;
            if (common._lastMesh && this.stage.$3d.children[common._lastMesh.uuid]) {
                common.attach(this, 'morpher', common._lastMesh);
            }
            else {
                common._lastMesh = null;
            }
            if (common._lastJoint != null) {
                attachJoint(this, common._lastJoint);
            }
            common.updateControlBar(this, 'systemtool', 'pickjoint');
        },
        mousemove: function (e) {
            var mesh = null;
            if (this.morpher.state === 0 && !common._down) {
                mesh = this.stage.getMeshByMouse(e);
                if (mesh == null || (mesh != null && !this.stage.activeMesh[mesh.uuid])) {
                    this.stage.changeMeshColor(mesh, 'hover');
                }
                return;
            }
            if (this.morpher.state === 1 && !common._down) {
                this.morpher.callFunction('hoverJoint');
                mesh = this.morpher.getHoverJoint(e);
                if (mesh != null) {
                    this.morpher.callFunction('hoverJoint', mesh);
                }
                return;
            }
            if (!common._down) return;
            var mouse3d = this.stage.getMouse3D(e);
            this.morpher.$2d.dragging(
                [e.clientX - common._mouse[0], e.clientY - common._mouse[1]],
                [mouse3d.x - common._mouse3d[0], mouse3d.y - common._mouse3d[1], mouse3d.z - common._mouse3d[2]]
            );
            common._mouse = [e.clientX, e.clientY];
            common._mouse3d = [mouse3d.x, mouse3d.y, mouse3d.z];
        },
        mouseup: function (e) {
            common._down = false;
            this.morpher.$2d.command = null;
        },
        mousedown: function (e) {
            if (e.button === 2) return;
            var mesh = null;
            var mouse3d = this.stage.getMouse3D(e);
            common._down = true;
            common._mouse3d = [mouse3d.x, mouse3d.y, mouse3d.z];
            common._mouse = [e.clientX, e.clientY];
            switch (this.morpher.state) {
                case 0:
                    mesh = this.stage.getMeshByMouse(e);
                    if (mesh != null) {
                        common.attach(this, 'morpher', mesh);
                    }
                    break;
                case 1:
                    mesh = this.morpher.getHoverJoint(e);
                    if (mesh != null) {
                        attachJoint(this, mesh);
                    }
                    else {
                        mesh = this.stage.getMeshByMouse(e);
                        if (mesh) {
                            common.attach(this, 'morpher', mesh);
                        }
                    }
                    break;
                default:
                    break;
            }
        },
        mouseRightClick: function (e) {
            common._down = false;
            if (this.morpher.state === 2) {
                detachJoint(this);
                return;
            }
            if (this.morpher.state === 1) {
                common.detach(this, 'morpher');
                return;
            }
        },
        unload: function () {
            common._down = false;
            common._lastMesh = this.morpher.mesh;
            common._lastJoint = this.morpher.joint;
            common.detach(this, 'morpher');
        }
    };
});

define(function (Require) {

    var _down = false;
    var _mouse = [-1, -1];
    var _mouse3d = [0, 0, 0];

    /**通用事件工厂**/

    function mousedown(e) {
        _down = true;
        _mouse = [e.clientX, e.clientY];
    }

    function mouseup(e) {
        _down = false;
    }

    return {

        cameramove: {
            mousemove: function (e) {
                if (!_down) {
                    return;
                }
                this.stage.cameraMove(e.clientX - _mouse[0], e.clientY - _mouse[1]);
                _mouse = [e.clientX, e.clientY];    
            },
            mousedown: mousedown,
            mouseup: mouseup,
            mouseleave: mouseup
        },
        pickgeo: {
            loaded: function () {
                var controlBar = this.ui.refs.containerleft.refs.controlbar;
                controlBar.setState({enablebar: controlBar.state.enablebar + 'transformer|'});
                _down = false;
            },
            mouseRightClick: function (e) {
                _down = false;
                this.stage.changeMeshColor(null, 'active');
                if (this.transformer.attached) {
                    this.transformer.detach();
                }
            },
            mousemove: function (e) {
                if (!_down) {
                    var mesh = this.stage.getMeshByMouse(e);
                    if (mesh == null || (mesh != null && !this.stage.activeMesh[mesh.uuid])) {
                        this.stage.changeMeshColor(mesh, 'hover');
                    }
                    return;
                }
                var mouse3d = this.stage.getMouse3D(e);
                this.transformer.$2d.dragging(
                    [e.clientX - _mouse[0], e.clientY - _mouse[1]],
                    [mouse3d.x - _mouse3d[0], mouse3d.y - _mouse3d[1], mouse3d.z - _mouse3d[2]]
                );
                _mouse = [e.clientX, e.clientY];
                _mouse3d = [mouse3d.x, mouse3d.y, mouse3d.z];
            },
            mouseup: function (e) {
                _down = false;
                this.transformer.$2d.command = null;
            },
            mousedown: function (e) {
                // 右键
                if (e.button === 2) {
                    return;
                }
                _down = true;
                var mouse3d = this.stage.getMouse3D(e);
                _mouse3d = [mouse3d.x, mouse3d.y, mouse3d.z];
                _mouse = [e.clientX, e.clientY];
                var mesh = this.stage.getMeshByMouse(e);
                if (mesh == null) {
                    return;
                }
                this.stage.changeMeshColor(null, 'active');
                this.stage.changeMeshColor(mesh, 'active');
                this.transformer.attach(mesh);
            },
            unload: function () {
                _down = false;
                this.transformer.detach();
                this.stage.changeMeshColor(null, 'active');
                this.stage.changeMeshColor(null, 'active');
                var controlBar = this.ui.refs.containerleft.refs.controlbar;
                controlBar.setState({enablebar: controlBar.state.enablebar.replace(/transformer\|/g, '')});
            }
        },
        pickjoint: {
            mousemove: function (e) {
                var mesh = null;
                if (this.morpher.state === 0 && !_down) {
                    mesh = this.stage.getMeshByMouse(e);
                    if (mesh == null || (mesh != null && !this.stage.activeMesh[mesh.uuid])) {
                        this.stage.changeMeshColor(mesh, 'hover');
                    }
                    return;
                }
                if (this.morpher.state === 1 && !_down) {
                    this.morpher.callFunction('hoverJoint');
                    mesh = this.morpher.getHoverJoint(e);
                    if (mesh != null) {
                        this.morpher.callFunction('hoverJoint', mesh);
                    }
                    else {
                        mesh = this.stage.getMeshByMouse(e);
                        if (mesh == null || (mesh != null && !this.stage.activeMesh[mesh.uuid])) {
                            this.stage.changeMeshColor(mesh, 'hover');
                        }
                    }
                    return;
                }
                if (!_down) return;
                var mouse3d = this.stage.getMouse3D(e);
                this.morpher.$2d.dragging(
                    [e.clientX - _mouse[0], e.clientY - _mouse[1]],
                    [mouse3d.x - _mouse3d[0], mouse3d.y - _mouse3d[1], mouse3d.z - _mouse3d[2]]
                );
                _mouse = [e.clientX, e.clientY];
                _mouse3d = [mouse3d.x, mouse3d.y, mouse3d.z];
            },
            mouseup: function (e) {
                _down = false;
                this.morpher.$2d.command = null;
            },
            mousedown: function (e) {
                if (e.button === 2) return;
                var mesh = null;
                var mouse3d = this.stage.getMouse3D(e);
                _down = true;
                _mouse3d = [mouse3d.x, mouse3d.y, mouse3d.z];
                _mouse = [e.clientX, e.clientY];
                switch (this.morpher.state) {
                    case 0:
                        mesh = this.stage.getMeshByMouse(e);
                        if (mesh != null) {
                            this.morpher.attach(mesh);
                            this.stage.changeMeshColor(null, 'active');
                            this.stage.changeMeshColor(mesh, 'active');
                        }
                        break;
                    case 1:
                        mesh = this.morpher.getHoverJoint(e);
                        if (mesh != null) {
                            this.morpher.attachJoint(mesh);
                        }
                        else {
                            mesh = this.stage.getMeshByMouse(e);
                            if (mesh) {
                                this.stage.changeMeshColor(null, 'active');
                                this.stage.changeMeshColor(mesh, 'active');
                                this.morpher.attach(mesh);
                            }
                        }
                        break;
                    default:
                        break;
                }
            },
            mouseRightClick: function (e) {
                _down = false;
                if (this.morpher.state === 2) {
                    this.morpher.detachJoint();
                    return;
                }
                if (this.morpher.state === 1) {
                    this.stage.changeMeshColor(null, 'active');
                    this.stage.changeMeshColor(null, 'hover');
                    this.morpher.detach();
                    return;
                }
            },
            unload: function () {
                _down = false;
                this.stage.changeMeshColor(null, 'active');
                this.stage.changeMeshColor(null, 'hover');
                this.morpher.detach();
            }
        }
    };


});

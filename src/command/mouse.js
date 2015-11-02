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

    function attach(me, helper, mesh) {
        me[helper].attach(mesh);
        me.ui.refs.containerright.refs.stageContent.refs.meshBox.setState({selected: mesh.uuid + ';'});
        me.stage.changeMeshColor(null, 'active');
        me.stage.changeMeshColor(mesh, 'active');
    }

    function detach(me, helper) {
        me[helper].detach();
        me.ui.refs.containerright.refs.stageContent.refs.meshBox.setState({selected: ''});
        me.stage.changeMeshColor(null, 'active');
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
                _down = false;
                var controlBar = this.ui.refs.containerleft.refs.controlbar
                controlBar.setState({enablebar: controlBar.state.enablebar + 'transformer|'}); 
            },
            mouseRightClick: function (e) {
                _down = false;
                this.stage.changeMeshColor(null, 'active');
                if (this.transformer.attached) {
                    detach(this, 'transformer');
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
                // 右键返回
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
                attach(this, 'transformer', mesh);
            },
            unload: function () {
                _down = false;
                detach(this, 'transformer');
                var controlBar = this.ui.refs.containerleft.refs.controlbar;
                controlBar.setState({
                    enablebar: controlBar.state.enablebar.replace(/transformer\|/g, '')
                });
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
                            attach(this, 'morpher', mesh);
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
                                attach(this, 'morpher', mesh);
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
                    detach(this, 'morpher');
                    return;
                }
            },
            unload: function () {
                _down = false;
                detach(this, 'morpher');
            }
        }
    };


});

define(function (Require) {

    var _down = false;
    var _mouse = [-1, -1];
    var _hover = null;
    var _active = null;

    /**通用事件工厂**/

    function mousedown(e) {
        _down = true;
        _mouse[0] = e.clientX;
        _mouse[1] = e.clientY;
    }
    function mouseup(e) {
        _down = false;
    }

    /**辅助方法**/

    /**
     * 鼠标移入移出物体改变颜色
     */
    function hover(mesh, stage) {
        if (_hover) {
            stage.changeMeshColor(_hover.uuid);
        }
        _hover = mesh;
        if (_hover) {
            stage.changeMeshColor(_hover.uuid, 'hover');
        }
        if (_active) {
            stage.changeMeshColor(_active.uuid, 'active');
        }
    }

    /**
     * 让物体处于激活状态
     */
    function active(mesh, stage) {
        if (_active) {
            stage.changeMeshColor(_active.uuid);
        }
        _active = mesh;
        if (_active) {
            stage.changeMeshColor(_active.uuid, 'active');
        }
    }


    return {
        cameramove: {
            mousemove: function (e) {
                if (!_down) {
                    return;
                }
                this.stage.cameraMove(e.clientX - _mouse[0], e.clientY - _mouse[1]);
                _mouse[0] = e.clientX;
                _mouse[1] = e.clientY;
            },
            mousedown: mousedown,
            mouseup: mouseup,
            mouseleave: mouseup
        },
        pickgeo: {
            loaded: function () {
                var controlBar = this.ui.refs.containerleft.refs.controlbar;
                controlBar.setState({enablebar: controlBar.state.enablebar + 'transformer|'});
            },
            mouseRightClick: function (e) {
                if (this.transformer.attached) {
                    this.transformer.detach();
                    active(null, this.stage);
                }
            },
            mousemove: function (e) {
                hover(this.stage.getMeshByMouse(e), this.stage);
            },
            mousedown: function (e) {
                var mesh = this.stage.getMeshByMouse(e);
                if (mesh == null) {
                    return;
                }
                active(mesh, this.stage);
                this.transformer.attach(mesh);
            },
            unload: function () {
                this.transformer.detach();
                active(null, this.stage);
                var controlBar = this.ui.refs.containerleft.refs.controlbar;
                controlBar.setState({enablebar: controlBar.state.enablebar.replace(/transformer\|/g, '')});
            }
        },
        pickjoint: {
            mousemove: function (e) {
                var mesh = null;
                if (this.morpher.getState() === 0 && !_down) {
                    mesh = this.stage.getMeshByMouse(e);
                    if (mesh) {
                        hover(mesh, this.stage);
                    }
                    return;
                }
                if (this.morpher.getState() === 1 && !_down) {
                    this.morpher.callFunction('hoverJoint');
                    mesh = this.stage.getMeshByMouse(e, this.morpher.getJoints());
                    if (mesh) {
                        this.morpher.callFunction('hoverJoint', mesh);
                    }
                    return;
                }
            },
            mousedown: function (e) {
                var mesh = null;
                switch (this.morpher.getState()) {
                    case 0:
                        mesh = this.stage.getMeshByMouse(e);
                        if (mesh != null) {
                            this.morpher.callFunction('attach', mesh);
                            active(mesh, this.stage);
                        }
                        break;
                    case 1:
                        mesh = this.stage.getMeshByMouse(e, this.morpher.getJoints());
                        if (mesh) {
                            this.morpher.callFunction('attachJoint', mesh);
                        }
                        else {
                            mesh = this.stage.getMeshByMouse(e);
                            if (mesh) {
                                active(mesh, this.stage);
                                this.morpher.callFunction('attach', mesh);
                            }
                        }
                        break;
                    default:
                        break;
                }
            },
            mouseRightClick: function (e) {
                if (this.morpher.getState() === 2) {
                    this.morpher.callFunction('detachJoint');
                    return;
                }
                if (this.morpher.getState() === 1) {
                    active(null, this.stage);
                    this.morpher.callFunction('detach');
                    return;
                }
            },
            unload: function () {
                active(null, this.stage);
                this.morpher.callFunction('detach');
            }
        }
    };
});

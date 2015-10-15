define(function (Require) {

    var _down = false;
    var _mouse = [-1, -1];

    /**通用事件工厂**/
    function mousedown(e) {
        _down = true;
        _mouse[0] = e.clientX;
        _mouse[1] = e.clientY;
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
                controlBar.setState({
                    enablebar: controlBar.state.enablebar + 'transformer|'
                });
            },
            mouseRightClick: function (e) {
                if (this.transformer.attached) {
                    this.transformer.detach();
                }
            },
            mousedown: function (e) {
                var mesh = this.stage.getMeshByMouse(e);
                if (mesh == null) {
                    return;
                }
                this.transformer.attach(mesh);
            },
            unload: function () {
                this.transformer.detach();
                var controlBar = this.ui.refs.containerleft.refs.controlbar;
                controlBar.setState({
                    enablebar: controlBar.state.enablebar.replace(/transformer\|/g, '')
                });
            }
        },
        pickjoint: {
            mousemove: function (e) {
                // 控制点鼠标hover
                if (this.morpher.getState() === 1 && !_down) {
                    this.morpher.callFunction('hoverJoint');
                    var mesh = this.stage.getMeshByMouse(e, this.morpher.getJoints());
                    if (mesh) {
                        this.morpher.callFunction('hoverJoint', mesh);
                    }
                }
            },
            mousedown: function (e) {
                var mesh = null;
                switch (this.morpher.getState()) {
                    case 0:
                        mesh = this.stage.getMeshByMouse(e);
                        if (mesh != null) {
                            this.morpher.callFunction('attach', mesh);
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
                    this.morpher.callFunction('detach');
                    return;
                }
            },
            unload: function () {
                this.morpher.callFunction('detach');
            }
        }
    };
});

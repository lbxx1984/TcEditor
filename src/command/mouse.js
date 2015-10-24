define(function (Require) {

    var _down = false;
    var _mouse = [-1, -1];
    var _mouse3d = [0, 0, 0];
    var _hover = null;
    var _active = null;

    /**通用事件工厂**/

    function mousedown(e) {
        _down = true;
        _mouse = [e.clientX, e.clientY];
    }

    function mouseup(e) {
        _down = false;
    }

    /**辅助方法**/

    /**
     * 鼠标移入移出物体改变颜色
     */
    function hover(mesh, stage) {
        clearHover();
        if (!mesh) return;
        _hover = mesh;
        addHover();
        function clearHover() {
            if (!_hover) return;
            var temp = _hover;
            _hover = null;
            if (_active && _active.uuid === temp.uuid) return;
            stage.changeMeshColor(temp.uuid);
        }
        function addHover() {
            if (!_hover) return;
            if (_active && _active.uuid === _hover.uuid) return;
            stage.changeMeshColor(_hover.uuid, 'hover');
        }
    }

    /**
     * 让物体处于激活状态
     */
    function active(mesh, stage) {
        if (_active) {
            stage.$2d.activeMesh = stage.activeMesh = '';
            stage.changeMeshColor(_active.uuid);
        }
        _active = mesh;
        if (_active) {
            stage.$2d.activeMesh = stage.activeMesh = _active.uuid;
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
                active(null, this.stage);
                hover(null, this.stage);
                if (this.transformer.attached) {
                    this.transformer.detach();
                }
            },
            mousemove: function (e) {
                if (!_down) {
                    hover(this.stage.getMeshByMouse(e), this.stage);
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
                _down = true;
                var mouse3d = this.stage.getMouse3D(e);
                _mouse3d = [mouse3d.x, mouse3d.y, mouse3d.z];
                _mouse = [e.clientX, e.clientY];
                var mesh = this.stage.getMeshByMouse(e);
                if (mesh == null) {
                    return;
                }
                active(mesh, this.stage);
                this.transformer.attach(mesh);
            },
            unload: function () {
                _down = false;
                this.transformer.detach();
                active(null, this.stage);
                hover(null, this.stage);
                var controlBar = this.ui.refs.containerleft.refs.controlbar;
                controlBar.setState({enablebar: controlBar.state.enablebar.replace(/transformer\|/g, '')});
            }
        },
        pickjoint: {
            mousemove: function (e) {
                var mesh = null;
                if (this.morpher.state === 0 && !_down) {
                    hover(this.stage.getMeshByMouse(e), this.stage);
                    return;
                }
                if (this.morpher.state === 1 && !_down) {
                    this.morpher.callFunction('hoverJoint');
                    mesh = this.morpher.getHoverJoint(e);
                    if (mesh != null) {
                        this.morpher.callFunction('hoverJoint', mesh);
                    }
                    else {
                        hover(this.stage.getMeshByMouse(e), this.stage);
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
                            active(mesh, this.stage);
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
                                active(mesh, this.stage);
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
                    hover(null, this.stage);
                    active(null, this.stage);
                    this.morpher.detach();
                    return;
                }
            },
            unload: function () {
                _down = false;
                hover(null, this.stage);
                active(null, this.stage);
                this.morpher.detach();
            }
        }
    };


});

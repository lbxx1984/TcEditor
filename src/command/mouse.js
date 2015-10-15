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
        pickjoint: {
            mousedown: function (e) {
                var mesh = null;
                switch (this.morpher.getState()) {
                    case 0:
                        mesh = this.stage.getMeshByMouse(e);
                        if (mesh != null) {
                            this.morpher.attach(mesh);
                        }
                        break;
                    case 1:
                        mesh = this.stage.getMeshByMouse(e, this.morpher.getJoints());
                        if (mesh) {
                            console.log(mesh.index);
                        }
                    default: break;

                }
            }
        },
        pickgeo: {
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
            }
        }
    };
});

/**
 * @file 拖拽创建物体引擎
 */
define(['../geometry/main'], function (geometry) {


    var _down = false;
    var _mouse3D = null;
    var _tempMesh = null;

    var exports = {};


    /**自动注册接口**/
    for (var key in geometry) {
        if (!geometry.hasOwnProperty(key)) {
            return;
        }
        exports[key] = {
            loaded: loaded,
            mousedown: mousedown,
            mousemove: mousemove(key),
            mouseup: mouseup(key),
            mouseleave: mouseleave
        };
    }


    /**通用事件工厂**/
    function loaded(e) {
        var controlBar = this.ui.refs.containerleft.refs.controlbar;
        controlBar.setState({systemtool: ''});
    }

    function mousedown(e) {
        _down = true;
        _mouse3D = this.stage.getMouse3D(e.layerX, e.layerY);
    }

    function mouseleave(e) {
        _down = false;
        this.stage.$3d.scene.remove(_tempMesh);
    }

    function mousemove(type) {
        return function (e) {
            if (!_down) {
                return;
            }
            var newMouse3D = this.stage.getMouse3D(e.layerX, e.layerY);
            this.stage.$3d.scene.remove(_tempMesh);
            _tempMesh = produceTempMesh({
                type: type,
                mouseDown: _mouse3D,
                mouseUp: newMouse3D
            });
            if (_tempMesh != null) {
                this.stage.$3d.scene.add(_tempMesh);
            }
        };
    }

    function mouseup(type) {
        return function (e) {
            _down = false;
            if (_tempMesh == null) {
                return;
            }
            var mesh = _tempMesh.clone();
            this.stage.$3d.scene.remove(_tempMesh);
            this.stage.add(mesh);
        };
    }


    /**
     * 根据鼠标状态创建临时物体
     *
     * @param {Object} param 鼠标动作描述
     * @param {Object} param.mouseDown 鼠标按下的3D坐标
     * @param {Object} param.mouseUp 鼠标抬起时的3D坐标
     * @param {string} param.type 想要创建的物体的类型
     */
    function produceTempMesh(param) {
        var mesh = geometry[param.type].tempMesh({
            material: new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            }),
            mouseDown: param.mouseDown,
            mouseUp: param.mouseUp
        });
        mesh.position.set(
            (param.mouseDown.x + param.mouseUp.x) / 2,
            (param.mouseDown.y + param.mouseUp.y) / 2,
            (param.mouseDown.z + param.mouseUp.z) / 2
        );
        return mesh;
    }


    return exports;
});

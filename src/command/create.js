/**
 * @file 拖拽创建物体引擎
 */
define(function (require) {

    var geometry = require('../geometry/main');
    var _mouseDraged = false;
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
        controlBar.setState({
            systemtool: '',
            cameraview: '3d'
        });
        this.stage.changeView('3d');
    }


    function mousedown(e) {
        _down = true;
        _mouseDraged = false;
        _mouse3D = this.stage.getMouse3D(e);
    }


    function mouseleave(e) {
        _down = false;
        _mouseDraged = false;
        this.stage.$3d.scene.remove(_tempMesh);
    }


    function mousemove(type) {
        return function (e) {
            if (!_down) {
                return;
            }
            _mouseDraged = true
            var newMouse3D = this.stage.getMouse3D(e);
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
            if (_tempMesh == null || !_mouseDraged) {
                return;
            }
            _mouseDraged = false;
            var mesh = _tempMesh.clone();
            this.stage.$3d.scene.remove(_tempMesh);
            this.stage.add(mesh);
            // 刷新右侧
            mesh.birth = new Date().getTime();
            this.ui.refs.containerright.refs.verticallist.refs.meshBox.setState({
                meshes: this.stage.$3d.children
            });
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
            material: new THREE.MeshLambertMaterial({
                // MeshLambertMaterial
                color: 0xe6e6e6,
                // map: THREE.ImageUtils.loadTexture('resources/textures/ash_uvgrid01.jpg'),
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

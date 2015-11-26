define(function (Require) {


    var editorDefaultConf = require('config/editorDefaultConf');


    /**
     * 设置matrix4
     *
     * @param {Object3D} obj 任何具有matrix属性的3D对象
     * @param {Array.<number>} a 长度为16的数组
     */
    function setMatrix4(obj, a) {
        var m = new THREE.Matrix4();
        // 系统导出matrix的是列优先，呵呵
        m.set(
            a[0], a[4], a[8], a[12],
            a[1], a[5], a[9], a[13],
            a[2], a[6], a[10], a[14],
            a[3], a[7], a[11], a[15] 
        );
        obj.applyMatrix(m);
    }


    /**
     * 设置color值
     *
     * @param {Object3D} obj 任何具有color属性的3D对象
     * @param {number} c 整数或16进制数标识的color
     */
    function setColor(obj, c) {
        obj.color = new THREE.Color(c);
    }


    /**
     * io系统，负责保存打开所有文件，以及文件解析
     *
     * @param {Object} param 配置参数
     * @param {Object} param.routing 全局控制路由
     */
    function IO(param) {
        this.routing = param.routing;
    }


    /**
     * 解析灯光
     *
     * @param {Object} item 灯光JSON
     */
    IO.prototype.processLight = function (item) {
        if (typeof THREE[item.type] !== 'function') {
            return;
        }
        var light = new THREE[item.type]();
        for (var key in item) {
            switch (key) {
                case 'matrix': setMatrix4(light, item[key]);break;
                case 'color': setColor(light, item[key]);break;
                default: light[key] = item[key];break;
            }
        }
        this.routing.light.add(light);
    };


    /**
     * 获取编辑器配置
     *
     * @return {string} 编辑器配置
     */
    IO.prototype.getEditorConf = function () {
        var me = this.routing;
        var result = editorDefaultConf;
        var stage = me.stage;
        result.camera = {
            a: parseInt(stage.cameraController.param.cameraAngleA),
            b: parseInt(stage.cameraController.param.cameraAngleB),
            r: parseInt(stage.$3d.param.cameraRadius),
            l: [
                parseInt(stage.$3d.param.cameraLookAt.x),
                parseInt(stage.$3d.param.cameraLookAt.y),
                parseInt(stage.$3d.param.cameraLookAt.z)
            ]
        };
        result.grid = {
            size: stage.$3d.param.gridSize,
            visible: stage.$3d.param.showGrid
        };
        result.controlBar =  me.ui.refs.containerleft.refs.controlbar.state;
        return JSON.stringify(result);
    }


    /**
     * 解析编辑配置
     *
     * @param {Object} conf 编辑器级别配置
     */
    IO.prototype.setEditorConf = function (conf) {
        var cameraController = this.routing.stage.cameraController;
        var stage3d = this.routing.stage.$3d;
        var controlBar = this.routing.ui.refs.containerleft.refs.controlbar;
        this.processLight(conf.defaultLight);
        cameraController.param.cameraAngleA = conf.camera.a;
        cameraController.param.cameraAngleB = conf.camera.b;
        cameraController.updateCameraPosition();
        stage3d.param.cameraRadius = conf.camera.r;
        stage3d.param.cameraAngleA = conf.camera.a;
        stage3d.param.cameraAngleB = conf.camera.b;
        stage3d.param.cameraLookAt = {x: conf.camera.l[0], y: conf.camera.l[1], z: conf.camera.l[2]};
        stage3d.updateCameraPosition();
        stage3d.param.gridSize = conf.grid.size;
        stage3d.resizeGrid(true);
        stage3d.resizeGrid(false);
        if (conf.grid.visible === false) {
            this.routing.stage.callFunction('toggleHelper');
            var btn = controlBar.getDOMNode().getElementsByClassName('icon-kejian');
            btn[0].dataset.uiValue = 1;
            btn[0].className = btn[0].className.replace('icon-kejian', 'icon-bukejian');
        }
        this.routing.main('view-' + conf.controlBar.cameraview);
        this.routing.main('mouse-' + conf.controlBar.systemtool);
    };


    return IO;
});

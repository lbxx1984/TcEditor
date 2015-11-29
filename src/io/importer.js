define(function (require) {


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
     * 解析灯光
     *
     * @param {Object} item 灯光JSON
     * @param {Object} 灯光对象
     */
    function processLight (item) {
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
        return light;
    };


    return {

        /** 导入舞台配置
         *
         * @param {Object} me routing对象
         * @param {Object} conf 舞台配置
         */
        editorConf: function (me, conf) {
            var cameraController = me.stage.cameraController;
            var stage2d = me.stage.$2d;
            var stage3d = me.stage.$3d;
            var controlBar = me.ui.refs.containerleft.refs.controlbar;

            me.light.add(processLight(conf.defaultLight));

            cameraController.param.cameraAngleA = conf.camera.a;
            cameraController.param.cameraAngleB = conf.camera.b;
            cameraController.updateCameraPosition();
            stage2d.param.scale = conf.camera.s;
            stage2d.param.cameraLookAt = {x: conf.camera.o[0], y: conf.camera.o[1]};
            stage3d.param.cameraRadius = conf.camera.r;
            stage3d.param.cameraAngleA = conf.camera.a;
            stage3d.param.cameraAngleB = conf.camera.b;
            stage3d.param.cameraLookAt = {x: conf.camera.l[0], y: conf.camera.l[1], z: conf.camera.l[2]};
            stage3d.updateCameraPosition();

            stage3d.param.gridSize = conf.grid.size;
            stage3d.resizeGrid(true);
            stage3d.resizeGrid(false);
            if (conf.grid.visible === false) {
                me.stage.callFunction('toggleHelper');
                var btn = controlBar.getDOMNode().getElementsByClassName('icon-kejian');
                btn[0].dataset.uiValue = 1;
                btn[0].className = btn[0].className.replace('icon-kejian', 'icon-bukejian');
            }

            // 由于鼠标引擎是异步加载的，这里hack一下
            setTimeout(function () {
                me.main('view-' + conf.controlBar.cameraview);
                me.main('mouse-' + conf.controlBar.systemtool);
            }, 200);
        }

    };

});

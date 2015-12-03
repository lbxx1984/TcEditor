define(function (require) {


    var geometryProducer = require('./geometryProducer');


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


    return {

        /**
         * 导入舞台配置
         * 此配置隐藏存放，用户不可操作
         *
         * @param {Object} me routing对象
         * @param {Object} conf 舞台配置
         */
        editorConf: function (me, conf) {
            var stage3d = me.stage.$3d;
            var controlBar = me.ui.refs.containerleft.refs.controlbar;
            var light = this.light(conf.defaultLight);
            me.light.add(light);
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
        },

        /**
         * 导入摄像机配置
         * 此配置隐藏存放，用户不可操作
         *
         * @param {Object} me routing对象
         * @param {Object} conf 摄像机配置
         */
        camera: function (me, conf) {
            var stage2d = me.stage.$2d;
            var stage3d = me.stage.$3d;
            var cameraController = me.stage.cameraController;
            cameraController.param.cameraAngleA = conf.a;
            cameraController.param.cameraAngleB = conf.b;
            cameraController.updateCameraPosition();
            stage2d.param.scale = conf.s;
            stage2d.param.cameraLookAt = {x: conf.o[0], y: conf.o[1]};
            stage3d.param.cameraRadius = conf.r;
            stage3d.param.cameraAngleA = conf.a;
            stage3d.param.cameraAngleB = conf.b;
            stage3d.param.cameraLookAt = {x: conf.l[0], y: conf.l[1], z: conf.l[2]};
            stage3d.updateCameraPosition();
        },

        /**
         * 解析灯光对象
         * 此配置公开存放，用户可以操作
         *
         * @param {Object} item 灯光对象
         * @return {?THREE.Light} 3D灯光对象
         */
        light: function (item) {
            if (typeof THREE[item.type] !== 'function') {
                return null;
            }
            var light = new THREE[item.type]();
            for (var key in item) {
                switch (key) {
                    case 'matrix': setMatrix4(light, item[key]); break;
                    case 'color': light.color = new THREE.Color(item[key]); break;
                    default: light[key] = item[key]; break;
                }
            }
            return light;
        },

        /**
         * 解析物体对象
         * 此配置公开存放，用户可以操作
         *
         * @param {Object} mesh 物体对象
         * @return {?THREE.Mesh} 3D物体对象
         */
        mesh: function (mesh) {
            try {
                var geometry = geometryProducer(mesh.geometry.type)(mesh.geometry.parameters);
                var material = new THREE[mesh.material.type]();
                var geo3D = new THREE.Mesh(geometry, material);
                
                // 导入面
                var faces = mesh.geometry.faces;
                for (var i = 0; i < geometry.faces.length; i++) {
                    var face = geometry.faces[i];
                    face.a = faces[i * 3];
                    face.b = faces[i * 3 + 1];
                    face.x = faces[i * 3 + 2];
                }

                // 导入顶点
                var vertices = mesh.geometry.vertices;
                for (var i = 0; i < geometry.vertices.length; i++) {
                    geometry.vertices[i].set(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
                }

                // 导入材质
                var materialValue = {};
                for (var key in mesh.material) {
                    switch (key) {
                        case 'color': materialValue[key] = new THREE.Color(mesh.material[key]); break;
                        case 'emissive': materialValue[key] = new THREE.Color(mesh.material[key]); break;
                        default: materialValue[key] = mesh.material[key]; break;
                    }
                }
                material.setValues(materialValue);

                // 导入物体信息
                for (var key in mesh) {
                    switch (key) {
                        case 'material': break;
                        case 'geometry': break;
                        case 'matrix': setMatrix4(geo3D, mesh[key]); break;
                        case 'birth': geo3D[key] = new Date(mesh[key]); break;
                        default: geo3D[key] = mesh[key]; break;
                    }
                }

                return geo3D;
            }
            catch (e) {
                console.error(e.message);
                return null;
            }
        }
    };

});

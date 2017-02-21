define(function (require) {


    var THREE = require('three');
    var Transformer3D = require('three-lib/TransformControls');
    var math = require('./math');


    // 清理所有锚点
    function clearAnchors(me) {
        me.anchors.map(function (anchor) {
            if (!anchor.added) return;
            anchor.added = false;
            me.scene.remove(anchor);
        });
    }


    // 修改物体顶点位置
    function onControllerChange() {
        if (!this.vector || !this.mesh) return;
        var vector = this.vector;
        var mesh = this.mesh;
        var pos = math.world2local(vector.position.x, vector.position.y, vector.position.z, mesh);
        mesh.geometry.vertices[vector.index].x = pos[0];
        mesh.geometry.vertices[vector.index].y = pos[1];
        mesh.geometry.vertices[vector.index].z = pos[2];
        mesh.geometry.verticesNeedUpdate = true;
        vector.scale.x = vector.scale.y = vector.scale.z
            = this.camera.position.distanceTo(vector.position) / this.anchorSize;
    }


    /**
     * 变形器构造函数
     * @constructor
     * @param {Object} param 构造参数
     * @param {Object} param.scene 变形器所在的舞台
     * @param {Object} param.camera 与变形器互动的摄像机
     * @param {Object} param.renderer 变形器所在的渲染引擎
     */
    function Morpher3D(param) {
        // 当前绑定物体
        this.mesh = null;
        // 当前处于受控状态的顶点
        this.vector = null;
        // 锚点颜色
        this.anchorColor = param.anchorColor;
        // 锚点大小
        this.anchorSize = param.anchorSize;
        // 舞台
        this.scene = param.scene;
        // 摄像机
        this.camera = param.camera;
        // 渲染引擎
        this.renderer = param.renderer;
        // 顶点控制器
        this.controller = new THREE.TransformControls(this.camera, this.renderer.domElement);
        // 顶点锚点
        this.anchors = [];
        // 绑定控制器事件
        this.controller.addEventListener('objectChange', onControllerChange.bind(this));
    }


    /**
     * 绑定物体
     * @param {Object} mesh 待绑定的物体
     */
    Morpher3D.prototype.attach = function (mesh) {
        if (!mesh) return;
        this.mesh = mesh;
        this.vector = null;
        clearAnchors(this);
        var camerapos = this.camera.position;
        var matrix = math.getRotateMatrix(mesh);
        var vertices = mesh.geometry.vertices;
        var anchors = this.anchors;
        var scene = this.scene;
        var anchorSize = this.anchorSize;
        var anchorColor = this.anchorColor;
        vertices.map(function (ver, index) {
            var pos = math.local2world(ver.x, ver.y, ver.z, matrix, mesh);
            var meshpos = new THREE.Vector3(pos[0], pos[1], pos[2]);
            var np = null;
            if (index === anchors.length) {
                np = new THREE.Mesh(
                    new THREE.BoxGeometry(10, 10, 10, 1, 1, 1),
                    new THREE.MeshBasicMaterial({color: anchorColor, side: THREE.DoubleSide})
                );
                np.tc = {
                    materialColor: np.material.color.getHex()
                };
                anchors.push(np);
            }
            else {
                np = anchors[index];
            }
            np.index = index;
            np.position.x = pos[0];
            np.position.y = pos[1];
            np.position.z = pos[2];
            np.scale.x = np.scale.y = np.scale.z = meshpos.distanceTo(camerapos) / anchorSize;
            np.added = true;
            scene.add(np);
        });
    };


    /**
     * 绑定锚点
     * @param {Object} mesh 待绑定的锚点
     */
    Morpher3D.prototype.attachAnchor = function (mesh) {
        this.controller.attach(mesh);
        this.vector = mesh;
    };


    /**
     * 解绑物体
     */
    Morpher3D.prototype.detach = function () {
        this.mesh = null;
        this.vector = null;
        clearAnchors(this);
    };


    /**
     * 解绑锚点
     */
    Morpher3D.prototype.detachAnchor = function () {
        this.controller.detach();
        this.vector = null;
    };


    /**
     * 更新锚点
     */
    Morpher3D.prototype.updateAnchors = function () {
        var camerapos = this.camera.position;
        var anchorSize = this.anchorSize;
        this.anchors.map(function (anchor, index) {
            if (!anchor.added) return;
            anchor.scale.x = anchor.scale.y = anchor.scale.z = camerapos.distanceTo(anchor.position) / anchorSize; 
        });
    };


    /**
     * 更新锚点颜色
     */
    Morpher3D.prototype.setAnchorColor = function (color) {
        this.anchors.map(function (anchor) {
            anchor.tc.materialColor = color;
            anchor.material.setValues({color: color});
        });
    };


    /**
     * 更新锚点尺寸
     */
    Morpher3D.prototype.setAnchorSize = function (size) {
        size = Math.min(size, 1000);
        size = Math.max(size, 500);
        this.anchorSize = size;
        this.updateAnchors();
    }

    return Morpher3D;


});
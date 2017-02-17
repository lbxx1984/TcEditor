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
        // 当前处于受控状态的关节
        this.joint = null;
        // 锚点大小
        this.anchorSize = 1000;
        // 舞台
        this.scene = param.scene;
        // 摄像机
        this.camera = param.camera;
        // 渲染引擎
        this.renderer = param.renderer;
        // 关节控制器
        this.controller = new THREE.TransformControls(this.camera, this.renderer.domElement);
        // 关节锚点
        this.anchors = [];
    }


    /**
     * 绑定物体
     * @param {Object} mesh 待绑定的物体
     */
    Morpher3D.prototype.attach = function (mesh) {
        if (!mesh) return;
        this.mesh = mesh;
        clearAnchors(this);
        var camerapos = this.camera.position;
        var matrix = math.getRotateMatrix(mesh);
        var vertices = mesh.geometry.vertices;
        var anchors = this.anchors;
        var scene = this.scene;
        var anchorSize = this.anchorSize;
        vertices.map(function (ver, index) {
            var pos = math.local2world(ver.x, ver.y, ver.z, matrix, mesh);
            var meshpos = new THREE.Vector3(pos[0], pos[1], pos[2]);
            var np = null;
            if (index === anchors.length) {
                np = new THREE.Mesh(
                    new THREE.BoxGeometry(10, 10, 10, 1, 1, 1),
                    new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide})
                );
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
     * 解绑定物体
     */
    Morpher3D.prototype.detach = function () {
        this.mesh = null;
        clearAnchors(this);
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


    return Morpher3D;

    // var math = require('math');

    // /**
    //  * @constructor
    //  */
    // function Morpher3D(param) {
    //     this.helperColor = param.helperColor || ;
    //     this.helperHoverColor = param.helperHoverColor || ;
    //     this.baseRule = 1000;
    //     this.joints = [];
    //     this.geo = null; // 当前绑定的3D物体
    //     this.joint = null; // 当前绑定的3D关节
    //     this.hover = null; // 鼠标经过的关节
    //     this.jointCtrler.addEventListener('objectChange', changeHandler);

    //     /**关节移动处理**/
    //     function changeHandler() {
    //         if (me.joint == null || me.geo == null) {
    //             return;
    //         }
    //         var joint = me.joint;
    //         var geo = me.geo;
    //         var pos = math.world2local(joint.position.x, joint.position.y, joint.position.z, geo);
    //         geo.geometry.vertices[joint.index].x = pos[0];
    //         geo.geometry.vertices[joint.index].y = pos[1];
    //         geo.geometry.vertices[joint.index].z = pos[2];
    //         geo.geometry.verticesNeedUpdate = true;
    //         var r = me.stage.camera.position.distanceTo(joint.position) / me.baseRule;
    //         joint.scale.x = joint.scale.y = joint.scale.z = r;
    //         // fire change
    //         if (typeof me.onChange === 'function') {
    //             me.onChange();
    //         }
    //     }
    // }


    // Morpher3D.prototype.updateAttachedJoint = function () {
    //     if (this.joint == null || this.geo == null) return;
    //     var joint = this.joint;
    //     var mesh = this.geo;
    //     var camerapos = this.stage.camera.position;
    //     var matrix = math.getRotateMatrix(mesh);
    //     var vector = mesh.geometry.vertices[joint.index];
    //     var pos = math.local2world(vector.x, vector.y, vector.z, matrix, mesh);
    //     var meshpos = new THREE.Vector3(pos[0], pos[1], pos[2]);
    //     joint.position.x = pos[0];
    //     joint.position.y = pos[1];
    //     joint.position.z = pos[2];
    //     joint.scale.x = joint.scale.y = joint.scale.z = meshpos.distanceTo(camerapos) / this.baseRule;
    //     this.jointCtrler.update();
    // };


    // /**
    //  * 鼠标经过控制点
    //  */
    // Morpher3D.prototype.hoverJoint = function (meshIndex) {
    //     if (this.hover != null) {
    //         this.hover.material.setValues({color: this.helperColor});
    //     }
    //     if (isNaN(meshIndex)) return;
    //     this.hover = this.joints[meshIndex];
    //     if (this.hover != null) {
    //         this.hover.material.setValues({color: this.helperHoverColor});
    //     }
    // };



    // /**
    //  * 绑定关节控制器
    //  *
    //  * @param {number} mesh 关节索引
    //  */
    // Morpher3D.prototype.attachJoint = function (jointIndex) {
    //     if (isNaN(jointIndex) || jointIndex >= this.joints.length) return;
    //     var mesh = this.joints[jointIndex];
    //     this.jointCtrler.attach(mesh);
    //     this.stage.scene.add(this.jointCtrler);
    //     this.jointCtrler.update();
    //     this.stage.updateWithCamera.jointMover = this.jointCtrler;
    //     this.joint = mesh;
    // };


    // /**
    //  * 解除关节控制器
    //  */
    // Morpher3D.prototype.detachJoint = function () {
    //     this.jointCtrler.detach();
    //     this.stage.scene.remove(this.jointCtrler);
    //     this.stage.updateWithCamera.jointMover = null;
    //     this.joint = null;
    // }
});
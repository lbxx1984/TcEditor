define(function (require) {


    var THREE = require('three');
    var Transformer3D = require('three-lib/TransformControls');


    /**
     * 变形器构造函数
     * @constructor
     * @param {Object} param 构造参数
     * @param {Object} param.scene 变形器所在的舞台
     * @param {Object} param.camera 与变形器互动的摄像机
     * @param {Object} param.renderer 变形器所在的渲染引擎
     */
    function Morpher3D(param) {
        // 工作状态：0 闲置状态；1 已经选中物体; 2 已经选中物体某个关节
        this.status = 0;
        // 舞台
        this.scene = param.scene;
        // 摄像机
        this.camera = param.camera;
        // 渲染引擎
        this.renderer = param.renderer;
    }


    return Morpher3D;

    // var math = require('math');

    // /**
    //  * @constructor
    //  */
    // function Morpher3D(param) {
    //     var me = this;
    //     this.stage = param.stage;
    //     this.jointCtrler = new THREE.TransformControls(this.stage.camera, this.stage.renderer.domElement);
    //     this.helperColor = param.helperColor || 0xd97915;
    //     this.helperHoverColor = param.helperHoverColor || 0xffff00;
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
    //  * 刷新，修正控制点大小
    //  */
    // Morpher3D.prototype.update = function () {
    //     var camerapos = this.stage.camera.position;
    //     var joints = this.joints;
    //     for (var n = 0; n < joints.length; n++) {
    //         var joint = joints[n];
    //         if (!joint.added) {
    //             break;
    //         }
    //         var s = camerapos.distanceTo(joint.position) / this.baseRule;
    //         joint.scale.x = joint.scale.y = joint.scale.z = s; 
    //     }
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
    //  * 控制器绑定物体
    //  *
    //  * @param {Object} mesh 3D物体
    //  */
    // Morpher3D.prototype.attach = function (mesh) {
    //     if (!mesh) {
    //         return;
    //     }
    //     this.clearStage();
    //     var camerapos = this.stage.camera.position;
    //     var matrix = math.getRotateMatrix(mesh);
    //     var vertices = mesh.geometry.vertices;

    //     for (var n = 0; n < vertices.length; n++) {
    //         var pos = math.local2world(vertices[n].x, vertices[n].y, vertices[n].z, matrix, mesh);
    //         var meshpos = new THREE.Vector3(pos[0], pos[1], pos[2]);
    //         var np = null;
    //         if (n == this.joints.length) {
    //             np = new THREE.Mesh(
    //                 new THREE.BoxGeometry(10, 10, 10, 1, 1, 1),
    //                 new THREE.MeshBasicMaterial({color: this.helperColor, side: THREE.DoubleSide})
    //             );
    //             this.joints.push(np);
    //         }
    //         else {
    //             np = this.joints[n];
    //         }
    //         np.index = n;
    //         np.position.x = pos[0];
    //         np.position.y = pos[1];
    //         np.position.z = pos[2];
    //         np.scale.x = np.scale.y = np.scale.z = meshpos.distanceTo(camerapos) / this.baseRule;
    //         np.added = true;
    //         this.stage.scene.add(np);
    //     }
    //     this.stage.updateWithCamera.morpher = this;
    //     this.geo = mesh;
    // };


    // /**
    //  * 控制器解绑物体
    //  */
    // Morpher3D.prototype.detach = function () {
    //     this.clearStage();
    //     this.stage.updateWithCamera.morpher = null;
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


    // /**
    //  * 从舞台移除所有关节
    //  */
    // Morpher3D.prototype.clearStage = function () {
    //     for (var n = 0; n < this.joints.length; n++) {
    //         var joint = this.joints[n];
    //         if (!joint.added) {
    //             break;
    //         }
    //         joint.added = false;
    //         this.stage.scene.remove(joint);
    //     }
    // };


    // return Morpher3D;
});
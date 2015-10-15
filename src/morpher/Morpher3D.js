define(['math', 'three/TransformControls'], function (math) {


    /**
     * @constructor
     */
    function Morpher3D(param) {
        var me = this;
        this.stage = param.stage;
        this.jointCtrler = new THREE.TransformControls(this.stage.camera, this.stage.renderer.domElement);
        this.helperColor = param.helperColor || 0xd97915;
        this.helperHoverColor = param.helperHoverColor || 0xffff00;
        this.baseRule = 1000;
        this.joints = [];
        this.geo = null; // 当前绑定的物体
        this.joint = null; // 当前绑定的关节
        this.state = 0; // 状态机，0未attach；1已经attach未选中关节；2已选中关节
        this.hover = null;
        this.jointCtrler.addEventListener('objectChange', changeHandler);

        /**关节移动处理**/
        function changeHandler() {
            if (me.joint == null || me.geo == null) {
                return;
            }
            var joint = me.joint;
            var geo = me.geo;
            var pos = math.Global2Local(joint.position.x, joint.position.y, joint.position.z, geo);
            geo.geometry.vertices[joint.index].x = pos[0];
            geo.geometry.vertices[joint.index].y = pos[1];
            geo.geometry.vertices[joint.index].z = pos[2];
            geo.geometry.verticesNeedUpdate = true;
            var r = me.stage.camera.position.distanceTo(joint.position) / me.baseRule;
            joint.scale.x = joint.scale.y = joint.scale.z = r;
        }
    }


    /**
     * 从舞台移除所有关节
     */
    Morpher3D.prototype.clearStage = function () {
        for (var n = 0; n < this.joints.length; n++) {
            var joint = this.joints[n];
            if (!joint.added) {
                break;
            }
            joint.added = false;
            this.stage.scene.remove(joint);
        }
    };


    /**
     * 刷新，修正控制点大小
     */
    Morpher3D.prototype.update = function () {
        var camerapos = this.stage.camera.position;
        var joints = this.joints;
        for (var n = 0; n < joints.length; n++) {
            var joint = joints[n];
            if (!joint.added) {
                break;
            }
            var s = camerapos.distanceTo(joint.position) / this.baseRule;
            joint.scale.x = joint.scale.y = joint.scale.z = s; 
        }
    };


    /**
     * 鼠标经过控制点
     */
    Morpher3D.prototype.hoverJoint = function (mesh) {
        if (this.hover != null) {
            this.hover.material.setValues({color: this.helperColor});
        }
        this.hover = mesh;
        if (this.hover != null) {
            mesh.material.setValues({color: this.helperHoverColor});
        }
    };


    /**
     * 控制器绑定物体
     *
     * @param {Object} mesh 3D物体
     */
    Morpher3D.prototype.attach = function (mesh) {
        if (!mesh) {
            return;
        }
        this.clearStage();
        var camerapos = this.stage.camera.position;
        var matrix = math.rotateMatrix(mesh);
        var vertices = mesh.geometry.vertices;

        for (var n = 0; n < vertices.length; n++) {
            var pos = math.Local2Global(vertices[n].x, vertices[n].y, vertices[n].z, matrix, mesh);
            var meshpos = new THREE.Vector3(pos[0], pos[1], pos[2]);
            var np = null;
            if (n == this.joints.length) {
                np = new THREE.Mesh(
                    new THREE.BoxGeometry(10, 10, 10, 1, 1, 1),
                    new THREE.MeshBasicMaterial({color: this.helperColor, side: THREE.DoubleSide})
                );
                this.joints.push(np);
            }
            else {
                np = this.joints[n];
            }
            np.index = n;
            np.position.x = pos[0];
            np.position.y = pos[1];
            np.position.z = pos[2];
            np.scale.x = np.scale.y = np.scale.z = meshpos.distanceTo(camerapos) / this.baseRule;
            np.added = true;
            this.stage.scene.add(np);
        }
        this.stage.updateWithCamera.morpher = this;
        this.geo = mesh;
        this.state = 1;
    };


    /**
     * 控制器解绑物体
     */
    Morpher3D.prototype.detach = function () {
        if (this.state === 0) {
            return;
        }
        if (this.state === 2) {
            this.detachJoint();
        }
        this.clearStage();
        this.state = 0;
    };


    /**
     * 绑定关节控制器
     */
    Morpher3D.prototype.attachJoint = function (mesh) {
        this.state = 2;
        this.jointCtrler.attach(mesh);
        this.stage.scene.add(this.jointCtrler);
        this.jointCtrler.update();
        this.stage.updateWithCamera.transformer = this.jointCtrler;
        this.joint = mesh;
    };


    /**
     * 解除关节控制器
     */
    Morpher3D.prototype.detachJoint = function () {
        if (this.state !== 2) {
            return;
        }
        this.state = 1;
        this.jointCtrler.detach();
        this.stage.scene.remove(this.jointCtrler);
        this.stage.updateWithCamera.transformer = null;
        this.joint = null;
    }


    return Morpher3D;
});
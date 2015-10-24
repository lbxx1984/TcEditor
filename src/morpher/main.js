define(['./Morpher3D', './Morpher2D'], function (Morpher3D, Morpher2D) {


    function Morpher(stage) {
        this.type = '$3d';
        this.$2d = new Morpher2D({
            stage: stage.$2d,
            helperColor: '#00ff00',
            helperHoverColor: '#ffff00'
        });
        this.$3d = new Morpher3D({
            stage: stage.$3d,
            helperColor: 0x00ff00,
            helperHoverColor: 0xffff00
        });
        this.stage = stage;
        this.mesh = null;
        this.state = 0; // 状态机：(0)未attach；(1)已经attach未选中关节；(2)已选中关节
    }


    Morpher.prototype.attach = function (mesh) {
        this.mesh = mesh;
        this.$3d.attach(mesh);
        this.$2d.attach(mesh);
        this.state = 1;
    };


    Morpher.prototype.detach = function () {
        if (this.state === 2) {
            this.detachJoint();
        }
        this.mesh = null;
        this.$3d.detach();
        this.$2d.detach();
        this.state = 0;
    };


    Morpher.prototype.getHoverJoint = function (e) {
        if (this.type === '$3d') {
            var joint = this.stage.getMeshByMouse(e, this.$3d.joints);
            if (joint) joint = joint.index;
            return joint;
        }
        return this.$2d.hover;
    };


    Morpher.prototype.attachJoint = function (joint) {
        this.$3d.attachJoint(joint);
        this.$2d.attachJoint(joint);
        this.state = 2;
    };


    Morpher.prototype.detachJoint = function () {
        this.$3d.detachJoint();
        this.$2d.detachJoint();
        this.state = 1;
    };


    Morpher.prototype.update = function (type) {
        this.type = type;
    };


    Morpher.prototype.callFunction = function (func, param) {
        if (
            this[this.type]
            && typeof this[this.type][func] === 'function'
        ) {
            return this[this.type][func](param);
        }
        console.warn(func + ' is not a function!');
        return null;
    };


    return Morpher;
});
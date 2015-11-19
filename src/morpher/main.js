define(function (require) {


    var Morpher3D = require('./Morpher3D');
    var Morpher2D = require('./Morpher2D');


    function Morpher(stage) {
        var me = this;
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
        this.joint = null;
        this.state = 0; // 状态机：(0)未attach；(1)已经attach未选中关节；(2)已选中关节
        this.$2d.onChange = this.$3d.onChange = function () {
            if (typeof me.onChange === 'function') {
                me.onChange(me.joint);
            }
        }
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


    /**
     * 绑定关节
     *
     * @param {number} joint 关节序列，对应mesh.geometry.vectories的索引
     */
    Morpher.prototype.attachJoint = function (joint) {
        this.$3d.attachJoint(joint);
        this.$2d.attachJoint(joint);
        this.state = 2;
        this.joint = joint;
    };


    Morpher.prototype.detachJoint = function () {
        this.$3d.detachJoint();
        this.$2d.detachJoint();
        this.state = 1;
        this.joint = null;
    };


    Morpher.prototype.update = function (type) {
        this.type = type;
        this.$3d.updateAttachedJoint();
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
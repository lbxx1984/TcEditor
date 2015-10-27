define(['require', './Transformer2D'], function (require) {


    var Transformer2D = require('./Transformer2D');


    function Transformer(stage) {
        this.type = '$3d';
        this.$3d = new THREE.TransformControls(stage.$3d.camera, stage.$3d.renderer.domElement);
        this.$2d = new Transformer2D({stage: stage.$2d});
        this.stage = stage;
        this.mesh = null;
        this.attached = false;
    }


    Transformer.prototype.callFunction = function (func, param) {
        if (
            this[this.type]
            && typeof this[this.type][func] === 'function'
        ) {
            return this[this.type][func](param);
        }
        console.warn(func + ' is not a function!');
        return null;
    };


    Transformer.prototype.get = function (key) {
        return this[this.type][key];
    };


    Transformer.prototype.attach = function (mesh) {
        this.mesh = mesh;
        this.$2d.attach(mesh);
        this.$3d.attach(mesh);
        this.stage.$3d.scene.add(this.$3d);
        this.stage.$3d.updateWithCamera.transformer = this.$3d;
        this.$3d.update();
        this.attached = true;
    };


    Transformer.prototype.detach = function () {
        if (!this.attached) {
            return;
        }
        this.$3d.detach();
        this.$2d.detach();
        this.mesh = null;
        this.stage.$3d.scene.remove(this.$3d);
        this.stage.$3d.updateWithCamera.transformer = null;
        this.attached = false;
    };


    Transformer.prototype.update = function (type) {
        this.type = type;
        this.$3d.update();
    };


    return Transformer;
});
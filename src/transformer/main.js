define(['require', 'three/TransformControls'], function (require) {

    function Transformer(stage) {
        this.type = '$3d';
        this.$3d = new THREE.TransformControls(stage.$3d.camera, stage.$3d.renderer.domElement);
        this.stage = stage;
        this.attached = false;
    }

    Transformer.prototype.attach = function (mesh) {
        this[this.type].attach(mesh);
        if (this.type === '$3d') {
            this.stage.$3d.scene.add(this.$3d);
            this.$3d.update();
            this.stage.$3d.updateWithCamera.transformer = this.$3d;
        }
        this.attached = true;
    };

    Transformer.prototype.detach = function () {
        if (!this.attached) {
            return;
        }
        if (this.type === '$3d') {
            this.stage.$3d.scene.remove(this.$3d);
            this.stage.$3d.updateWithCamera.transformer = null;
        }
        this.attached = false;
    };

    return Transformer;
});
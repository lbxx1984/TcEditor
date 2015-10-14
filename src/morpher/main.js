define(['./Morpher3D'], function (Morpher3D) {


    function Morpher(stage) {
        this.type = '$3d';
        this.$3d = new Morpher3D({
            stage: stage.$3d,
            helperColor: 0xff0000,
            helperHoverColor: 0xffff00
        });
        this.stage = stage;
        this.attached = false;
    }

    Morpher.prototype.attach = function (mesh) {
        this[this.type].attach(mesh);
        this.attached = true;
    };

    return Morpher;
});
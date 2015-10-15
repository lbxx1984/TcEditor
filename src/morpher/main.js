define(['./Morpher3D'], function (Morpher3D) {


    function Morpher(stage) {
        this.type = '$3d';
        this.$3d = new Morpher3D({
            stage: stage.$3d,
            helperColor: 0x00ff00,
            helperHoverColor: 0xffff00
        });
        this.stage = stage;
    }

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

    Morpher.prototype.getState = function () {
        return this[this.type].state;
    };

    Morpher.prototype.getJoints = function () {
        var joints = this[this.type].joints;
        var result = [];
        for (var n = 0; n < joints.length; n++) {
            if (joints[n].added) {
                result.push(joints[n]);
            }
        }
        return result;
    };

    return Morpher;
});
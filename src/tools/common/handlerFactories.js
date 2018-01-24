
define(function (require) {


    var math = require('core/math');


    return {
        math: function (handler, me) {
            var width = me.container.offsetWidth;
            var height = me.container.offsetHeight;
            var axis = me.axis;
            var stageInfo = {
                v: axis.join('o'),
                a: me.cameraAngleA,
                b: (me.cameraAngleB % 360 + 360) % 360
            };
            var trans = [
                me.cameraLookAt[axis[0]],
                me.cameraLookAt[axis[1]]
            ];
            var rotate = stageInfo.v === 'xoz' ? (stageInfo.b - 90) : 0;
            var scale = me.cameraRadius / 1000;
            return function (x, y) {
                return math[handler](x, y, width, height, trans, scale, rotate, stageInfo);
            };
        },
        local2world: function (me) {
            return function (x, y, z) {
                var matrix = math.getRotateMatrix(me.mesh);
                var arr = math.local2world(x, y, z, matrix, me.mesh);
                return {
                    x: arr[0],
                    y: arr[1],
                    z: arr[2]
                };
            };
        }
    };



});
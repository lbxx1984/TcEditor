
import math from 'core/math';

export default function (handler, me) {
    const width = me.container.offsetWidth;
    const height = me.container.offsetHeight;
    const axis = me.axis;
    const stageInfo = {
        v: axis.join('o'),
        a: me.cameraAngleA,
        b: (me.cameraAngleB % 360 + 360) % 360
    };
    const trans = [
        me.cameraLookAt[axis[0]],
        me.cameraLookAt[axis[1]]
    ];
    const rotate = stageInfo.v === 'xoz' ? (stageInfo.b - 90) : 0;
    const scale = me.cameraRadius / 1000;
    return function (x, y) {
        return math[handler](x, y, width, height, trans, scale, rotate, stageInfo);
    };
}

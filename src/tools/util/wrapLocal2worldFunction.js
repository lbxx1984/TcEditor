
import math from 'core/math';
import array2axis from './array2axis';

export default function (me) {
    return function (x, y, z) {
        const matrix = math.getRotateMatrix(me.mesh);
        const arr = math.local2world(x, y, z, matrix, me.mesh);
        return array2axis(arr);
    };
}

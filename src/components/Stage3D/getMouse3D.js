/**
 * @file 3D 舞台 获取根据坐标纸获取3D鼠标位置
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import {Vector3} from 'three';

export default function getMouse3D(x, y, me, geo) {
    const width = me.refs.container.offsetWidth;
    const height = me.refs.container.offsetHeight;
    me.raycaster.setFromCamera(new Vector3((x / width) * 2 - 1, - (y / height) * 2 + 1, 0), me.camera);
    const intersects = me.raycaster.intersectObjects([geo]);
    return intersects.length > 0 ? intersects[0].point.clone() : new Vector3();
}

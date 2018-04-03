/**
 * @file 3D舞台拾取物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import getHoverMeshByMouse3D from './util/getHoverMeshByMouse3D';
import getMesh3dArray from './util/getMesh3dArray';
import pickupMesh from './util/pickupMesh';

let intersected = null;

export default function (param, dragging) {
    const selectedMesh = this.get('selectedMesh');
    // 初始化工具
    if (this.get('tool') !== 'pickMesh') {
        this.fill({
            tool: 'pickMesh',
            selectedVector: null,
            selectedVectorIndex: -1
        });
        return;
    }
    // 拾取物体
    if (param === 'mouseup' && intersected) {
        pickupMesh(selectedMesh, intersected, this);
        return;
    }
    // 拖拽容忍
    if (typeof param !== 'object' || dragging) return;
    // hover物体
    intersected = getHoverMeshByMouse3D(param, selectedMesh, getMesh3dArray(this));
}

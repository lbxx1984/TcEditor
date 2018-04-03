/**
 * @file 2D舞台拾取物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import getHoverMeshByMouse2D from './util/getHoverMeshByMouse2D';
import pickupMesh from './util/pickupMesh';

let intersected = null;

export default function(param, dragging) {
    const selectedMesh = this.get('selectedMesh');
    // 拾取物体
    if (param === 'mouseup' && intersected) {
        pickupMesh(selectedMesh, intersected, this);
        return;
    }
    // 拖拽容忍
    if (typeof param !== 'object' || dragging) return;
    // hover物体
    intersected = getHoverMeshByMouse2D(param, selectedMesh);
}

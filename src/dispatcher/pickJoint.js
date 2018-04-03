/**
 * @file 3D舞台拾取物体关节
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import getHoverMeshByMouse3D from './util/getHoverMeshByMouse3D';
import getHoverVectorByMouse3D from './util/getHoverVectorByMouse3D';
import getMesh3dArray from './util/getMesh3dArray';
import clearIntersectedColor from './util/clearIntersectedColor';
import pickupMesh from './util/pickupMesh';
import pickupVector from './util/pickupVector';

let intersected = null;
let intersectedVector = null;

export default function (param, dragging) {
    const selectedMesh = this.get('selectedMesh');
    const selectedVector = this.get('selectedVector');
    // 初始化工具
    if (this.get('tool') !== 'pickJoint') {
        this.fill({
            tool: 'pickJoint',
            selectedVector: null,
            selectedVectorIndex: -1
        });
        return;
    }
    // 拾取物体拾取关节
    if (param === 'mouseup' && intersectedVector) {
        pickupVector(selectedVector, intersectedVector, this);
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
    if (selectedMesh == null) {
        intersected = getHoverMeshByMouse3D(param, selectedMesh, getMesh3dArray(this));
        return;
    }
    // hover关节
    if (selectedMesh != null) {
        clearIntersectedColor(intersected, selectedMesh);
        intersectedVector = getHoverVectorByMouse3D(param, selectedVector, selectedMesh);
        if (intersectedVector) return;
        intersected = getHoverMeshByMouse3D(param, selectedMesh, getMesh3dArray(this));
    }
}

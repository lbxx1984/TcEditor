/**
 * @file 3D舞台拾取灯光
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import clearObject3dColor from './util/clearObject3dColor';
import getHoverMeshByMouse3D from './util/getHoverMeshByMouse3D';
import pickupLight from './util/pickupLight';

let intersected = null;

export default function(param, dragging) {
    let selectedLight = this.get('selectedLight');
    // 初始化工具
    if (this.get('tool') !== 'pickLight') {
        clearObject3dColor(this.get('selectedMesh'));
        clearObject3dColor(this.get('selectedVector'));
        if (selectedLight && selectedLight.tc) {
            selectedLight = selectedLight.tc.lightKey;
        }
        this.fill({
            tool: 'pickLight',
            selectedMesh: null,
            selectedVector: null,
            selectedVectorIndex: -1,
            selectedLight: typeof selectedLight === 'string' ? selectedLight : null
        });
        return;
    }
    // 拾取物体
    if (param === 'mouseup' && intersected) {
        pickupLight(selectedLight, intersected, this);
        return;
    }
    // 拖拽容忍
    if (typeof param !== 'object' || dragging) return;
    // hover物体
    intersected = getHoverMeshByMouse3D(param, null, param.stage3D.lightHelper.anchorArray);
}

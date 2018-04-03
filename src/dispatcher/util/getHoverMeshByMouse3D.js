/**
 * @file 获取舞台中属于hover状态的物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import getObject3dByMouse3D from './getObject3dByMouse3D';
import clearIntersectedColor from './clearIntersectedColor';
import config from '../../config';

let intersected = null;

export default function(param, selectedMesh, targetMeshes) {
    const obj = getObject3dByMouse3D(
        param.event.nativeEvent.offsetX,
        param.event.nativeEvent.offsetY,
        param.stage3D,
        targetMeshes
    );
    if (obj) {
        if (obj.tc.locked) return;
        if (selectedMesh && obj.uuid === selectedMesh.uuid) return;
        clearIntersectedColor(intersected, selectedMesh);
        intersected = obj;
        intersected.material.setValues({color: config.colors.normalMeshHover[0]});
    }
    else if (intersected) {
        clearIntersectedColor(intersected, selectedMesh);
        intersected = null;
    }
    return intersected;
}

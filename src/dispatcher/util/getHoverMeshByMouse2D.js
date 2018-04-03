/**
 * @file 获取舞台中属于hover状态的物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import clearIntersectedColor from './clearIntersectedColor';
import config from '../../config';

let intersected = null;

export default function(param, selectedMesh) {
    const mouse2d = param.mouseCurrent2D;
    const obj = param.stage2D.renderer2D.getObject2dByMouse2D(mouse2d.x, mouse2d.y);
    if (obj) {
        if (obj.tc.locked) return;
        if (selectedMesh && obj.uuid === selectedMesh.uuid) return;
        clearIntersectedColor(intersected, selectedMesh);
        intersected = obj;
        intersected.material.setValues({color: config.colors.normalMeshHover[0]});
    }
    else if(intersected) {
        clearIntersectedColor(intersected, selectedMesh);
        intersected = null;
    }
    return intersected;
}

/**
 * @file 获取舞台中属于hover状态的物体关节
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import getObject3dByMouse3D from './getObject3dByMouse3D';
import clearIntersectedColor from './clearIntersectedColor';
import config from '../../config';

let intersectedVector = null;

export default function(param, selectedVector) {
    const obj = getObject3dByMouse3D(
        param.event.nativeEvent.offsetX,
        param.event.nativeEvent.offsetY,
        param.stage3D,
        param.stage3D.morpher.anchors.filter(i => i.added)
    );
    if (obj) {
        clearIntersectedColor(intersectedVector, selectedVector);
        intersectedVector = obj;
        intersectedVector.material.setValues({color: config.colors.normalMeshHover[0]});
    }
    else if (intersectedVector) {
        clearIntersectedColor(intersectedVector, selectedVector);
        intersectedVector = null;
    }
    return intersectedVector;
}

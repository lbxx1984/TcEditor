/**
 * @file 判断入参是否可以拖拽生成物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function(param, dragging) {
    return dragging
        && typeof param === 'object'
        && Math.abs(param.cameraInfo.angleA) > 2
        && !(param.mouseDelta3D.x === 0 && param.mouseDelta3D.y === 0 && param.mouseDelta3D.z === 0);
}

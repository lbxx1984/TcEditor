/**
 * @file 获取拖拽区域的尺寸
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(mouseDown3D, mouseCurrent3D) {
    const x = (mouseDown3D.x + mouseCurrent3D.x) / 2;
    const y = (mouseDown3D.y + mouseCurrent3D.y) / 2;
    const z = (mouseDown3D.z + mouseCurrent3D.z) / 2;
    return {x, y, z};
}

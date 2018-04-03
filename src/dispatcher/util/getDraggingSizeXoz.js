/**
 * @file 获取拖拽区域的尺寸
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function(mouseDown3D, mouseCurrent3D) {
    const width = Math.abs(mouseDown3D.x - mouseCurrent3D.x);
    const height = Math.abs(mouseDown3D.z - mouseCurrent3D.z);
    return {width, height};
}

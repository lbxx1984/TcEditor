/**
 * @file 两点间距离
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(mouseDown3D, mouseCurrent3D) {
    const dx = mouseDown3D.x - mouseCurrent3D.x;
    const dy = mouseDown3D.y - mouseCurrent3D.y;
    const dz = mouseDown3D.z - mouseCurrent3D.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

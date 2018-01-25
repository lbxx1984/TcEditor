/**
 * @file 清理3D物体的选中色
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(mesh) {
    if (!mesh) return;
    mesh.material.setValues({
        color: mesh.tc.materialColor,
        opacity: mesh.tc.materialOpacity
    });
}

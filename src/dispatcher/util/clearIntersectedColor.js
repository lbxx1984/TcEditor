/**
 * @file 清理3D物体的hover色
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import config, {SELECTED_MESH_OPACITY} from '../../config';

export default function(obj, selected) {
    if (!obj) return;
    const color = selected && selected.uuid === obj.uuid
        ? config.colors.selectedMesh[0] : obj.tc.materialColor;
    const opacity = selected && selected.uuid === obj.uuid
        ? SELECTED_MESH_OPACITY : (obj.tc.materialOpacity || 1);
    obj.material.setValues({
        color,
        opacity,
        transparent: opacity < 1
    });
}

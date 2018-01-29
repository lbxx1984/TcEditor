/**
 * @file 将物体拾取到model中
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import clearObject3dColor from './clearObject3dColor';
import config, {SELECTED_MESH_OPACITY} from '../../config';

export default function(selectedMesh, intersected, me) {
    if (selectedMesh && selectedMesh.uuid === intersected.uuid) return;
    clearObject3dColor(selectedMesh);
    clearObject3dColor(me.get('selectedVector'));
    intersected.material.setValues({
        color: config.colors.selectedMesh[0],
        opacity: SELECTED_MESH_OPACITY,
        transparent: true
    });
    me.fill({
        selectedMesh: intersected,
        morpher3Dinfo: {
            ...me.get('morpher3Dinfo'),
            anchorColor: intersected.tc.anchorColor
        },
        selectedVector: null,
        selectedVectorIndex: -1
    });
}

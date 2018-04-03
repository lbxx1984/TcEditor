/**
 * @file 将物体关节拾取到model中
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import clearObject3dColor from './clearObject3dColor';
import config from '../../config';

export default function(selectedVector, intersectedVector, me) {
    if (selectedVector && selectedVector.uuid === intersectedVector.uuid) return;
    clearObject3dColor(selectedVector);
    intersectedVector.material.setValues({color: config.colors.selectedMesh[0]});
    me.fill({
        selectedVector: intersectedVector,
        selectedVectorIndex: intersectedVector.tc.index
    });
}

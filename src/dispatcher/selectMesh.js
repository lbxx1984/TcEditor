/**
 * @file 选择物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import clearObject3dColor from './util/clearObject3dColor';
import config from '../config';

export default function (uuid) {
    const selectedMesh = this.get('selectedMesh');
    const mesh = this.get('mesh3d')[uuid];
    if (!mesh || mesh.tc.locked || !mesh.visible) return;
    if (selectedMesh && selectedMesh.uuid === uuid) return;
    clearObject3dColor(selectedMesh);
    clearObject3dColor(this.get('selectedVector'));
    mesh.material.setValues({color: config.colors.selectedMesh[0]});
    this.fill({
        selectedMesh: mesh,
        selectedVector: null,
        selectedVectorIndex: -1
    });
}

/**
 * @file 锁定分组
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import clearObject3dColor from './util/clearObject3dColor';

export default function (groupId, locked) {
    const dataset = {
        timer: +new Date()
    };
    const selectedMesh = this.get('selectedMesh');
    const meshes = this.get('mesh3d');
    Object.keys(meshes).map(key => {
        const mesh = meshes[key];
        if (mesh.tc.group !== groupId) return;
        mesh.tc.locked = locked;
        if (selectedMesh && selectedMesh.uuid === mesh.uuid) {
            clearObject3dColor(selectedMesh);
            dataset.selectedMesh = null;
            dataset.selectedVector = null;
            dataset.selectedVectorIndex = -1;
        }
    });
    this.fill(dataset);
}

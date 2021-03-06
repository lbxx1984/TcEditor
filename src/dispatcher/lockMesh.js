/**
 * @file 锁定物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import clearObject3dColor from './util/clearObject3dColor';

export default function(uuid) {
    const dataset = {
        timer: +new Date()
    };
    const mesh = this.get('mesh3d')[uuid];
    if (!mesh) return;
    mesh.tc.locked = !mesh.tc.locked;
    const selectedMesh = this.get('selectedMesh');
    if (selectedMesh && selectedMesh.uuid === uuid) {
        clearObject3dColor(selectedMesh);
        dataset.selectedMesh = null;
        dataset.selectedVector = null;
        dataset.selectedVectorIndex = -1;
    }
    this.fill(dataset);
}

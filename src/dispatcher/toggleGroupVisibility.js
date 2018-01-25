/**
 * @file 切换物体的显示状态
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import clearObject3dColor from './util/clearObject3dColor';

export default function(groupId, visible) {
    const dataset = {
        timer: +new Date()
    };
    const selectedMesh = this.get('selectedMesh');
    const meshes = this.get('mesh3d');
    Object.keys(meshes).map(key => {
        const mesh = meshes[key];
        if (mesh.tc.group !== groupId) return;
        mesh.visible = visible;
        if (selectedMesh && selectedMesh.uuid === mesh.uuid) {
            clearObject3dColor(selectedMesh);
            dataset.selectedMesh = null;
            dataset.selectedVector = null;
            dataset.selectedVectorIndex = -1;
        }
    });
    this.fill(dataset);
}

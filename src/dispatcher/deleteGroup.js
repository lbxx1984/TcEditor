/**
 * @file 删除分组
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(groupId, removeMesh) {
    const group = [];
    const mesh3d = {...this.get('mesh3d')};
    const selectedMesh = this.get('selectedMesh');
    const dataset = {
        group,
        mesh3d,
        activeGroup: this.get('activeGroup') === groupId ? 'default group' : this.get('activeGroup'),
        timer: +new Date()
    };
    this.get('group').map(function (item) {
        if (item.label === groupId) return;
        group.push(item);
    });
    Object.keys(mesh3d).map(key => {
        const mesh = mesh3d[key];
        if (mesh.tc.group !== groupId) return;
        if (!removeMesh || mesh.tc.locked) {
            mesh.tc.group = 'default group';
            return;
        }
        delete mesh3d[key];
        if (selectedMesh && selectedMesh.uuid === key) {
            dataset.selectedMesh = null;
            dataset.selectedVector = null;
            dataset.selectedVectorIndex = -1;
        }
    });
    this.fill(dataset);
}


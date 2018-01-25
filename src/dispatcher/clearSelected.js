/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function () {
    const tool = this.get('tool');
    const selectedMesh = this.get('selectedMesh');
    const selectedVector = this.get('selectedVector');
    const selectedVectorIndex = this.get('selectedVectorIndex');
    const selectedLight = this.get('selectedLight');
    if (tool === 'tool-pickJoint' && (selectedVector || selectedVectorIndex > -1)) {
        selectedVector && selectedVector.material.setValues({color: selectedVector.tc.materialColor});
        this.fill({
            selectedVector: null,
            selectedVectorIndex: -1
        });
        return;
    }
    if (selectedLight) {
        this.set('selectedLight', null);
    }
    if (selectedMesh) {
        selectedMesh.material.setValues({
            color: selectedMesh.tc.materialColor,
            opacity: selectedMesh.tc.materialOpacity,
            transparent: selectedMesh.tc.materialOpacity < 1
        });
        this.set('selectedMesh', null);
    }
}

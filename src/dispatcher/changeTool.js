/**
 * @file 修改系统工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function(value) {
    const selectedMesh = this.get('selectedMesh');
    if (selectedMesh) {
        selectedMesh.material.setValues({color: selectedMesh.tc.materialColor});
    }
    const view = value.indexOf('geometry-') === 0 && this.get('view') !== 'all' ? '3d' : this.get('view');
    const stage = {...this.get('stage')};
    stage.camera3D = {...stage.camera3D};
    stage.camera3D.cameraAngleA = value.indexOf('geometry-') === 0 && Math.abs(stage.camera3D.cameraAngleA) < 2
        ? 40 : stage.camera3D.cameraAngleA;
    this.fill({
        tool: value,
        view: view,
        stage: stage,
        selectedMesh: null
    });
}

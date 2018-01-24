/**
 * @file 拖动摄像机
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function (param, dragging) {
    if (this.get('tool') !== 'moveCamera') {
        const selectedMesh = this.get('selectedMesh');
        if (selectedMesh) {
            selectedMesh.material.setValues({color: selectedMesh.tc.materialColor});
        }
        this.fill({
            tool: 'moveCamera',
            selectedMesh: null
        });
        return;
    }
    if (!dragging) return;
    let stage = param.stage3D;
    const angleB = stage.props.cameraAngleB;
    const speed = stage.props.cameraMoveSpeed;
    const cameraPos = stage.camera.position;
    const dx = stage.props.cameraRadius * param.mouseDelta2D.x * speed * 0.2 / stage.refs.container.offsetWidth;
    const dy = stage.props.cameraRadius * param.mouseDelta2D.y * speed * 0.2 / stage.refs.container.offsetHeight;
    let lookAt = stage.props.cameraLookAt;
    lookAt = {x: lookAt.x, y: lookAt.y, z: lookAt.z};
    if (Math.abs(stage.props.cameraAngleA) > 2) {
        lookAt.x -= Math.sin(Math.PI * angleB / 180) * dx;
        lookAt.z += Math.cos(Math.PI * angleB / 180) * dx;
        lookAt.x -= Math.cos(Math.PI * angleB / 180) * dy * Math.abs(cameraPos.y) / cameraPos.y;
        lookAt.z -= Math.sin(Math.PI * angleB / 180) * dy * Math.abs(cameraPos.y) / cameraPos.y;
    }
    else {
        lookAt.x -= Math.sin(Math.PI * angleB / 180) * dx;
        lookAt.z += Math.cos(Math.PI * angleB / 180) * dx;
        lookAt.y += dy;
    }
    stage = {...this.get('stage')};
    stage.camera3D = {
        ...stage.camera3D,
        lookAt
    };
    this.set('stage', stage);
}

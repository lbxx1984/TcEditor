/**
 * @file 拖动2d摄像机
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function (param, dragging) {
    if (!dragging || param === 'mouseup') return;
    const stage = {...this.get('stage')};
    const oldPos = param.stage2D.grid2D.getMouse3D(0, 0);
    const newPos = param.stage2D.grid2D.getMouse3D(param.mouseDelta2D.x, param.mouseDelta2D.y);
    const dPos = [newPos[0] - oldPos[0], newPos[1] - oldPos[1]];
    const lookAt = JSON.parse(JSON.stringify(param.stage2D.props.cameraLookAt));
    lookAt[param.stage2D.props.axis[0]] -= dPos[0];
    lookAt[param.stage2D.props.axis[1]] -= dPos[1];
    stage.camera3D = {
        ...stage.camera3D,
        lookAt
    };
    this.set('stage', stage);            
}

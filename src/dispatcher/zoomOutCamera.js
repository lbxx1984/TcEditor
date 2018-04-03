/**
 * @file 推进摄像机
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function() {
    const stage = {...this.get('stage')};
    let radius = stage.camera3D.cameraRadius;
    radius = radius + 0.2 * radius * 240 / document.body.offsetWidth;
    radius = Math.max(radius, 50);
    radius = Math.min(radius, 5000);
    stage.camera3D = {
        ...stage.camera3D,
        cameraRadius: radius
    };
    this.set('stage', stage);
}

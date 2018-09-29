/**
 * @file 3D 舞台 更新摄像机位置
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateCameraPosition(me, props) {
    props = props || me.props;
    const {cameraAngleA, cameraAngleB, cameraRadius, cameraLookAt} = props;
    const {coordinateContainer, grid, camera} = me;
    const y = cameraRadius * Math.sin(Math.PI * cameraAngleA / 180);
    const x = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.cos(Math.PI * cameraAngleB / 180);
    const z = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.sin(Math.PI * cameraAngleB / 180);
    if (Math.abs(cameraAngleA) < 2) {
        coordinateContainer.rotation.z = grid.rotation.z = Math.PI * 0.5 - Math.PI * cameraAngleB / 180;
        coordinateContainer.rotation.x = grid.rotation.x = Math.PI * 1.5;
    }
    else {
        coordinateContainer.rotation.z = grid.rotation.z = 0;
        coordinateContainer.rotation.x = grid.rotation.x = 0;
    }
    camera.position.set(
        x + cameraLookAt.x,
        y + cameraLookAt.y,
        z + cameraLookAt.z
    );
}

/**
 * @file 3D 舞台 更新摄像机属性
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import updateCameraPosition from './updateCameraPosition';

export default function updateCameraInfo(nextProps, me) {
    if (
        nextProps.cameraRadius !== me.props.cameraRadius
        || nextProps.cameraAngleA !== me.props.cameraAngleA
        || nextProps.cameraAngleB !== me.props.cameraAngleB
        || nextProps.cameraLookAt !== me.props.cameraLookAt
    ) {
        updateCameraPosition(me, nextProps);
        if (nextProps.tool === 'tool-pickJoint' && nextProps.selectedMesh) {
            me.morpher.updateAnchors();
        }
    }
}

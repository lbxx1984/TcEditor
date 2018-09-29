/**
 * @file 3D 舞台 更新摄像机属性
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import setCameraPosition from './setCameraPosition';

export default function updateCameraInfo(prevProps, me) {
    const nextProps = me.props;
    if (
        nextProps.cameraRadius !== prevProps.cameraRadius
        || nextProps.cameraAngleA !== prevProps.cameraAngleA
        || nextProps.cameraAngleB !== prevProps.cameraAngleB
        || nextProps.cameraLookAt !== prevProps.cameraLookAt
    ) {
        setCameraPosition(me, nextProps);
        if (nextProps.tool === 'pickJoint' && nextProps.selectedMesh) {
            me.morpher.updateAnchors();
        }
    }
}

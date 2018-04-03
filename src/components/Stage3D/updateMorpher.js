/**
 * @file 3D 舞台 更新修改工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateMorpher(nextProps, me) {
    if (
        nextProps.tool === 'pickJoint' && me.props.tool === 'pickJoint'
        && nextProps.selectedMesh && nextProps.selectedMesh === me.props.selectedMesh
        && nextProps.selectedMesh.tc.needUpdate
    ) {
        me.morpher.attach(nextProps.selectedMesh);
        nextProps.selectedVector && me.morpher.attachAnchor(nextProps.selectedVector);
    }
    if (
        nextProps.tool === 'pickJoint' && me.props.tool !== 'pickJoint'
        || (nextProps.selectedMesh !== me.props.selectedMesh && nextProps.tool === 'pickJoint')
    ) {
        me.morpher[nextProps.selectedMesh ? 'attach' : 'detach'](nextProps.selectedMesh);
        me.morpher.detachAnchor();
    }
    if (nextProps.selectedVector !== me.props.selectedVector && nextProps.tool === 'pickJoint') {
        me.morpher[nextProps.selectedVector ? 'attachAnchor' : 'detachAnchor'](nextProps.selectedVector);
    }
    if (nextProps.tool !== 'pickJoint' && me.props.tool === 'pickJoint') {
        me.morpher.detach();
        me.morpher.detachAnchor();
    }
    if (
        nextProps.tool === 'pickJoint'
        && nextProps.selectedVectorIndex !== me.props.selectedVectorIndex
        && me.morpher.mesh
        && me.morpher.anchors[nextProps.selectedVectorIndex]
        && me.morpher.anchors[nextProps.selectedVectorIndex].added
        && (
            !nextProps.selectedVector
            || (nextProps.selectedVector && nextProps.selectedVector.tc.index !== nextProps.selectedVectorIndex)
        )
    ) {
        me.context.dispatch('pickJointAnchor', me.morpher.anchors[nextProps.selectedVectorIndex]);
    }
    if (nextProps.morpher3Dinfo !== me.props.morpher3Dinfo) {
        me.morpher.setAnchorColor(nextProps.morpher3Dinfo.anchorColor);
        me.morpher.setAnchorSize(nextProps.morpher3Dinfo.anchorSize);
    }
}

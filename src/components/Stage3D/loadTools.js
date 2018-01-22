/**
 * @file 3D 舞台 加载工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function loadTools(me) {
    if (me.props.tool === 'tool-pickGeometry') {
        me.transformer[me.props.selectedMesh ? 'attach' : 'detach'](me.props.selectedMesh);
    }
    if (me.props.tool === 'tool-pickJoint') {
        me.morpher[me.props.selectedMesh ? 'attach' : 'detach'](me.props.selectedMesh);
        if (me.props.selectedMesh && me.props.selectedVector) {
            me.morpher.attachAnchor(me.morpher.anchors[me.props.selectedVector.tc.index]);
        }
        else if (
            me.props.selectedMesh && me.props.selectedVectorIndex > -1
            && me.morpher.anchors[me.props.selectedVectorIndex]
            && me.morpher.anchors[me.props.selectedVectorIndex].added
        ) {
            me.context.dispatch('morpher-3d-pick-anchor', me.morpher.anchors[me.props.selectedVectorIndex]);
        }
        else {
            me.morpher.detachAnchor();
        }
    }
    if (me.props.tool === 'tool-pickLight') {
        me.lightHelper.attach();
        if (me.props.selectedLight) {
            me.lightHelper.controller.attach(me.lightHelper.anchors[me.props.selectedLight.tc.lightKey]);
        }
        else {
            me.lightHelper.controller.detach();
        }
    }
}

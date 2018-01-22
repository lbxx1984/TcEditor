/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateMorpher(nextProps, me) {
    me.morpher2D.selectedVector = nextProps.selectedVector;
    if (nextProps.tool !== 'tool-pickJoint' && me.props.tool === 'tool-pickJoint') {
        me.morpher2D.detach();
    }
    if (nextProps.tool === 'tool-pickJoint' && me.props.tool !== 'tool-pickJoint' && nextProps.selectedMesh) {
        me.morpher2D.attach(nextProps.selectedMesh);
    }
    if (nextProps.tool === 'tool-pickJoint' && nextProps.selectedMesh !== me.props.selectedMesh) {
        me.morpher2D.attach(nextProps.selectedMesh);
        me.morpher2D.attachAnchor(null);
    }
    if (nextProps.tool === 'tool-pickJoint' && nextProps.selectedVectorIndex !== me.props.selectedVectorIndex) {
        me.morpher2D.attachAnchor(nextProps.selectedVectorIndex);
    }
    if (nextProps.tool === 'tool-pickJoint' && nextProps.timer !== me.props.timer && me.morpher2D.mesh) {
        me.morpher2D.attach(me.morpher2D.mesh);
        if (me.morpher2D.index != null) {
            me.morpher2D.attachAnchor(me.morpher2D.index);
        }
    }
    if (nextProps.morpher3Dinfo !== me.props.morpher3Dinfo) {
        me.morpher2D.color = nextProps.morpher3Dinfo.anchorColor;
        me.morpher2D.size = nextProps.morpher3Dinfo.anchorSize;
        if (me.morpher2D.mesh) {
            me.morpher2D.attach(me.morpher2D.mesh);
        }
    }
}

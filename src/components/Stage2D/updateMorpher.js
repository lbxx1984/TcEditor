/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateMorpher(prevProps, me) {
    const nextProps = me.props;
    me.morpher2D.selectedVector = nextProps.selectedVector;
    if (nextProps.tool !== 'pickJoint' && prevProps.tool === 'pickJoint') {
        me.morpher2D.detach();
    }
    if (nextProps.tool === 'pickJoint' && prevProps.tool !== 'pickJoint' && nextProps.selectedMesh) {
        me.morpher2D.attach(nextProps.selectedMesh);
    }
    if (nextProps.tool === 'pickJoint' && nextProps.selectedMesh !== prevProps.selectedMesh) {
        me.morpher2D.attach(nextProps.selectedMesh);
        me.morpher2D.attachAnchor(null);
    }
    if (nextProps.tool === 'pickJoint' && nextProps.selectedVectorIndex !== prevProps.selectedVectorIndex) {
        me.morpher2D.attachAnchor(nextProps.selectedVectorIndex);
    }
    if (nextProps.tool === 'pickJoint' && nextProps.timer !== prevProps.timer && me.morpher2D.mesh) {
        me.morpher2D.attach(me.morpher2D.mesh);
        if (me.morpher2D.index != null) {
            me.morpher2D.attachAnchor(me.morpher2D.index);
        }
    }
    if (nextProps.morpher3Dinfo !== prevProps.morpher3Dinfo) {
        me.morpher2D.color = nextProps.morpher3Dinfo.anchorColor;
        me.morpher2D.size = nextProps.morpher3Dinfo.anchorSize;
        if (me.morpher2D.mesh) {
            me.morpher2D.attach(me.morpher2D.mesh);
        }
    }
}

/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateTransformer(nextProps, me) {
    if (nextProps.tool !== 'tool-pickGeometry' && me.props.tool === 'tool-pickGeometry') {
        me.transformer2D.detach();
    }
    if (nextProps.tool === 'tool-pickGeometry' && me.props.tool !== 'tool-pickGeometry' && nextProps.selectedMesh) {
        me.transformer2D.attach(nextProps.selectedMesh);
    }
    if (nextProps.tool === 'tool-pickGeometry' && nextProps.selectedMesh !== me.props.selectedMesh) {
        me.transformer2D.attach(nextProps.selectedMesh);
    }
    if (nextProps.tool === 'tool-pickGeometry' && nextProps.timer !== me.props.timer && me.transformer2D.mesh) {
        me.transformer2D.attach(me.transformer2D.mesh);
    }
    if (nextProps.transformer3Dinfo !== me.props.transformer3Dinfo) {
        me.transformer2D.size = nextProps.transformer3Dinfo.size;
        me.transformer2D.mode = nextProps.transformer3Dinfo.mode;
        me.transformer2D.space = nextProps.transformer3Dinfo.space;
        if (me.transformer2D.mesh) {
            me.transformer2D.attach(me.transformer2D.mesh);
        }
    }
}

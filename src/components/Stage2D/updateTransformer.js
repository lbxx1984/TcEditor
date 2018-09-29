/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateTransformer(prevProps, me) {
    const nextProps = me.props;
    if (nextProps.tool !== 'pickMesh' && prevProps.tool === 'pickMesh') {
        me.transformer2D.detach();
    }
    if (nextProps.tool === 'pickMesh' && prevProps.tool !== 'pickMesh' && nextProps.selectedMesh) {
        me.transformer2D.attach(nextProps.selectedMesh);
    }
    if (nextProps.tool === 'pickMesh' && nextProps.selectedMesh !== prevProps.selectedMesh) {
        me.transformer2D.attach(nextProps.selectedMesh);
    }
    if (nextProps.tool === 'pickMesh' && nextProps.timer !== prevProps.timer && me.transformer2D.mesh) {
        me.transformer2D.attach(me.transformer2D.mesh);
    }
    if (nextProps.transformer3Dinfo !== prevProps.transformer3Dinfo) {
        me.transformer2D.size = nextProps.transformer3Dinfo.size;
        me.transformer2D.mode = nextProps.transformer3Dinfo.mode;
        me.transformer2D.space = nextProps.transformer3Dinfo.space;
        if (me.transformer2D.mesh) {
            me.transformer2D.attach(me.transformer2D.mesh);
        }
    }
}

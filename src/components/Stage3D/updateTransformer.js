/**
 * @file 3D 舞台 更新变形工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateTransformer(prevProps, me) {
    const nextProps = me.props;
    if (
        nextProps.tool === 'pickMesh' && prevProps.tool !== 'pickMesh'
        || (nextProps.selectedMesh !== prevProps.selectedMesh && nextProps.tool === 'pickMesh')
    ) {
        me.transformer[nextProps.selectedMesh ? 'attach' : 'detach'](nextProps.selectedMesh);
    }
    if (nextProps.tool !== 'pickMesh' && prevProps.tool === 'pickMesh') {
        me.transformer.detach();
    }
    if (nextProps.transformer3Dinfo !== prevProps.transformer3Dinfo) {
        me.transformer.setSpace(
            nextProps.transformer3Dinfo.mode === 'rotate' ? 'local' : nextProps.transformer3Dinfo.space
        );
        me.transformer.setMode(nextProps.transformer3Dinfo.mode);
        me.transformer.setSize(nextProps.transformer3Dinfo.size);
    }
}

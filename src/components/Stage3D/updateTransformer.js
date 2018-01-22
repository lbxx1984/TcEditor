/**
 * @file 3D 舞台 更新变形工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateTransformer(nextProps, me) {
    if (
        nextProps.tool === 'tool-pickGeometry' && me.props.tool !== 'tool-pickGeometry'
        || (nextProps.selectedMesh !== me.props.selectedMesh && nextProps.tool === 'tool-pickGeometry')
    ) {
        me.transformer[nextProps.selectedMesh ? 'attach' : 'detach'](nextProps.selectedMesh);
    }
    if (nextProps.tool !== 'tool-pickGeometry' && me.props.tool === 'tool-pickGeometry') {
        me.transformer.detach();
    }
    if (nextProps.transformer3Dinfo !== me.props.transformer3Dinfo) {
        me.transformer.setSpace(
            nextProps.transformer3Dinfo.mode === 'rotate' ? 'local' : nextProps.transformer3Dinfo.space
        );
        me.transformer.setMode(nextProps.transformer3Dinfo.mode);
        me.transformer.setSize(nextProps.transformer3Dinfo.size);
    }
}

/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateMesh(nextProps, me) {
    let needRenderer = false;
    if (Object.keys(nextProps.mesh3d).join(';') !== Object.keys(me.props.mesh3d).join(';')) {
        me.renderer2D.mesh3d = nextProps.mesh3d;
        needRenderer = true;
    }
    if (nextProps.timer !== me.props.timer) {
        needRenderer = true;
    }
    if (
        nextProps.selectedMesh
        && nextProps.selectedMesh.tc
        && nextProps.selectedMesh.tc.needUpdate
        && me.renderer2D.mesh2d[nextProps.selectedMesh.uuid]
    ) {
        me.renderer2D.mesh2d[nextProps.selectedMesh.uuid].update();
        needRenderer = true;
    }
    if (nextProps.selectedMesh !== me.props.selectedMesh) {
        needRenderer = true;
    }
    if (needRenderer) {
        me.renderer2D.render();
    }
}

/**
 * @file 3D 舞台 更新物体列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateMeshList(nextProps, me) {
    if (nextProps.mesh3d === me.props.mesh3d) return;
    const oldMeshHash = {
        ...me.props.mesh3d
    };
    Object.keys(nextProps.mesh3d).map(key => {
        const mesh = nextProps.mesh3d[key];
        delete oldMeshHash[mesh.uuid];
        if (mesh.tc.add) return;
        mesh.tc.add = true;
        me.scene.add(mesh);
    });
    Object.keys(oldMeshHash).map(key => {
        me.scene.remove(oldMeshHash[key]);
    });
}

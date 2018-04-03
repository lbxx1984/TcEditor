/**
 * @file 3D 舞台 加载3D物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function load3DObject(me) {
    // 加载灯光
    Object.keys(me.props.lights).map(key => {
        me.scene.add(me.props.lights[key]);
    });
    // 加载物体
    Object.keys(me.props.mesh3d).map(key => {
        me.scene.add(me.props.mesh3d[key]);
    });
}

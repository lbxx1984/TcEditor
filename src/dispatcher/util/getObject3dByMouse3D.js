/**
 * @file 用3D鼠标拾取3D对象
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';

export default function(x, y, stage, meshes) {
    const vector = new THREE.Vector3(
        (x / stage.refs.container.offsetWidth) * 2 - 1,
        -(y / stage.refs.container.offsetHeight) * 2 + 1,
        1
    );
    vector.unproject(stage.camera);
    stage.raycaster.ray.set(stage.camera.position, vector.sub(stage.camera.position).normalize());
    const intersects = stage.raycaster.intersectObjects(meshes || []);
    return intersects.length ? intersects[0].object : null;
}

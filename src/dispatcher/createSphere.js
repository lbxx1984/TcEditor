/**
 * @file 拖拽创建球体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';
import isDragCreatingParams from './util/isDragCreatingParams';
import getDistance from './util/getDistance';
import getDraggingCenter from './util/getDraggingCenter';
import getDefaultMaterial from './util/getDefaultMaterial';

export default function(param, dragging) {
    if (!isDragCreatingParams(param, dragging)) return;
    const stage = param.stage3D;
    const distance = getDistance(param.mouseDown3D, param.mouseCurrent3D);
    const center = getDraggingCenter(param.mouseDown3D, param.mouseCurrent3D);
    const material = getDefaultMaterial();
    if (stage.tempMesh) stage.scene.remove(stage.tempMesh);
    const geometry = new THREE.SphereGeometry(distance / 2, 20, 10);
    stage.tempMesh = new THREE.Mesh(geometry, material);
    stage.tempMesh.position.set(center.x, center.y, center.z);
    stage.scene.add(stage.tempMesh);
}

/**
 * @file 拖拽创建平面
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';
import isDragCreatingParams from './util/isDragCreatingParams';
import getDraggingSizeXoz from './util/getDraggingSizeXoz';
import getDraggingCenter from './util/getDraggingCenter';
import getDefaultMaterial from './util/getDefaultMaterial';

const BASE_SEGMENT_SIZE = 100;

export default function(param, dragging) {
    if (!isDragCreatingParams(param, dragging)) return;
    const stage = param.stage3D;
    const size = getDraggingSizeXoz(param.mouseDown3D, param.mouseCurrent3D);
    const center = getDraggingCenter(param.mouseDown3D, param.mouseCurrent3D);
    const material = getDefaultMaterial();
    if (stage.tempMesh) stage.scene.remove(stage.tempMesh);
    const segmentWidth = parseInt(size.width / BASE_SEGMENT_SIZE, 10);
    const segmentHeight = parseInt(size.height / BASE_SEGMENT_SIZE, 10);
    const geometry = new THREE.PlaneGeometry(size.width, size.height, segmentWidth, segmentHeight);
    stage.tempMesh = new THREE.Mesh(geometry, material);
    stage.tempMesh.rotation.x = -1.5 * Math.PI;
    stage.tempMesh.rotation.y = Math.PI;
    stage.tempMesh.position.set(center.x, center.y, center.z);
    stage.scene.add(stage.tempMesh);
}

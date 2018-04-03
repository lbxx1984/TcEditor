/**
 * @file 创建默认的材质
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';

export default function() {
    return new THREE.MeshPhongMaterial({
        color: 0xffffff, shading: THREE.FlatShading,
        side: THREE.DoubleSide
    });
}

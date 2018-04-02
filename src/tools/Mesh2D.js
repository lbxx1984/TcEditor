/**
 * 2D物体
 */
import {getRotateMatrix, local2world} from 'core/math';
import array2axis from './util/array2axis';


export default class Mesh2D {

    constructor(param) {
        Object.assign(this, param);
        this.update();
    }

    update() {
        const mesh3d = this.mesh3d;
        const matrix = getRotateMatrix(mesh3d);
        this.vertices = mesh3d.geometry.vertices.map(
            vector => array2axis(local2world(vector.x, vector.y, vector.z, matrix, mesh3d))
        );
    }

}

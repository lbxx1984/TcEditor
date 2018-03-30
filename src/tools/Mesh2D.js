/**
 * 2D物体
 */
import {getRotateMatrix, local2world} from 'core/math';
import arrayToAxis from './util/arrayToAxis';


export default class Mesh2D {

    constructor(param) {
        this.mesh3d = param.mesh3d;
        this.update();
    }

    update() {
        const mesh3d = this.mesh3d;
        const matrix = getRotateMatrix(mesh3d);
        this.vertices = mesh3d.geometry.vertices.map(
            vector => arrayToAxis(local2world(vector.x, vector.y, vector.z, matrix, mesh3d))
        );
    }

}

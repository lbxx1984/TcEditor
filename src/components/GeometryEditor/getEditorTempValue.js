/**
 * @file 物体编辑器，处理物料编辑脏数据
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import math from 'core/math';

export default function (props) {
    const mesh = props.mesh;
    const dataset = {
        posx: 0,
        posy: 0,
        posz: 0,
        scalex: 1,
        scaley: 1,
        scalez: 1,
        vectorx: 0,
        vectory: 0,
        vectorz: 0
    };
    if (!mesh) dataset;
    if (props.selectedVectorIndex > -1 && mesh.geometry.vertices[props.selectedVectorIndex]) {
        const matrix = math.getRotateMatrix(mesh);
        const vector = mesh.geometry.vertices[props.selectedVectorIndex];
        const pos = math.local2world(vector.x, vector.y, vector.z, matrix, mesh);
        dataset.vectorx = parseInt(pos[0], 10);
        dataset.vectory = parseInt(pos[1], 10);
        dataset.vectorz = parseInt(pos[2], 10);
    }
    dataset.posx = mesh.position.x;
    dataset.posy = mesh.position.y;
    dataset.posz = mesh.position.z;
    dataset.scalex = mesh.scale.x;
    dataset.scaley = mesh.scale.y;
    dataset.scalez = mesh.scale.z;
    return dataset;
}

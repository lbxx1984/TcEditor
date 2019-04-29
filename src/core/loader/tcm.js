/**
 * @file 将tcm文件导入到舞台
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
import {importImage} from 'core/io';
import * as THREE from 'three';
import math from '../math';


function createMatrix4(m) {
    let matrix = new THREE.Matrix4();
    matrix.set(
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15] 
    );
    return matrix;
}

function createGeometry(mesh) {
    const geo = mesh.geometries[0];
    if (typeof THREE[geo.type] !== 'function') return null;
    let args = [];
    switch (geo.type) {
        case 'PlaneGeometry':
            args = [geo.width, geo.height, geo.widthSegments, geo.heightSegments];
            break;
        case 'SphereGeometry':
            args = [geo.radius, geo.widthSegments, geo.heightSegments];
            break;
        default:
            return null;
    }
    const geometry = new THREE[geo.type](...args);
    // 导入物体骨骼
    for (let i = 0; i < geo.vertices.length; i += 3) {
        const index = parseInt(i / 3, 10);
        if (!geometry.vertices[index]) break;
        geometry.vertices[index].x = geo.vertices[i];
        geometry.vertices[index].y = geo.vertices[i + 1];
        geometry.vertices[index].z = geo.vertices[i + 2];
    }
    geometry.verticesNeedUpdate = true;
    return geometry;
}

function createMaterial(mesh, tcm) {
    const mtl = mesh.materials[0];
    if (typeof THREE[mtl.type] !== 'function') return;
    const args = {
        color: mesh.tc.materialColor,
        emissive: mesh.tc.materialEmissive,
        side: mtl.side
    };
    ['opacity', 'wireframe'].map(key => {
        if (!mtl.hasOwnProperty(key)) return;
        args[key] = mtl[key];
        if (key === 'opacity') args.transparent = mtl[key] < 1;
    });
    const material = new THREE[mtl.type](args);
    // 导入纹理
    if (mesh.textures instanceof Array && mesh.textures.length && tcm.images[mesh.textures[0].image]) {
        importImage(mesh.textures[0].image, tcm.images[mesh.textures[0].image]).then(img => {
            material.map = new THREE.Texture(img);
            material.map.needsUpdate = true;
            material.needsUpdate = true;
        });
    }
    return material;
}

function loadMesh(mesh, tcm) {
    const geometry = createGeometry(mesh);
    const material = createMaterial(mesh, tcm);
    if (!geometry) return null;
    const mesh3D = new THREE.Mesh(geometry, material);
    mesh3D.tc = mesh.tc;
    mesh3D.tc.birth = new Date(mesh.tc.birth);
    mesh3D.tc.add = false;
    mesh3D.tc.materialOpacity = material.opacity;
    mesh3D.tc.vectorLinkHash = math.getVectorLinkHash(geometry);
    return mesh3D;
}


export default function(model, tcm) {
    const dataset = {timer: +new Date()};
    // 导入物体
    dataset.mesh3d = {...model.store.mesh3d};
    Object.keys(tcm.meshes).map(uuid => {
        const json = tcm.meshes[uuid];
        const mesh = loadMesh(json, tcm);
        if (!mesh) return;
        mesh.applyMatrix(createMatrix4(json.object.matrix));
        dataset.mesh3d[mesh.uuid] = mesh;
    });
    // 导入舞台信息
    dataset.group = [].concat(model.store.group);
    tcm.editor.group.map(function (group) {
        for (let i = 0; i < dataset.group.length; i++) {
            if (dataset.group[i].label === group.label) return;
        }
        dataset.group.push(group);
    });
    // 导入灯光
    Object.keys(tcm.lights).map(uuid => {
        const json = tcm.lights[uuid];
        if (uuid === 'defaultLight') {
            const light = model.store.lights.defaultLight;
            light.position.set(json.object.matrix[12], json.object.matrix[13], json.object.matrix[14]);
            return;
        }
    });
    return dataset;
}

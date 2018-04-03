/**
 * @file 将舞台导出为tcm文件
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
import config from '../../config';


function mesh2obj(mesh) {
    const result = mesh.toJSON();
    result.tc = {...mesh.tc};
    result.tc.birth = result.tc.birth.getTime();
    delete result.tc.vectorLinkHash;
    result.geometries[0].vertices = JSON.parse(JSON.stringify(mesh.geometry.vertices));
    result.materials[0].color = result.tc.materialColor;
    result.materials[0].emissive = result.tc.materialEmissive;
    result.materials[0].opacity = result.tc.materialOpacity;
    return result;
}

function light2obj(light) {
    const result = light.toJSON();
    result.tc = {...light.tc};
    return result;
}

function deepCloneStore(store, except) {
    const result = {};
    Object.keys(store).map(key => {
        if (except.indexOf(key) > -1) return;
        try {
            result[key] = JSON.parse(JSON.stringify(store[key]));
        }
        catch (e) {
            result[key] = store[key];
        }
    });
    return result;
}

function compressFloat(mesh, fixed) {
    if (fixed === 0) return;
    mesh.geometries.map(function (geo) {
        const newArr = [];
        geo.vertices.map(function (v) {
            newArr.push(1 * parseFloat(v.x).toFixed(fixed));
            newArr.push(1 * parseFloat(v.y).toFixed(fixed));
            newArr.push(1 * parseFloat(v.z).toFixed(fixed));
        });
        geo.vertices = newArr;
    });
}


export default function (model) {

    const store = model.store;
    const meshes = {};
    const lights = {};
    const images = {};

    // 导出物体
    Object.keys(store.mesh3d).map(function (uuid) {
        const mesh = store.mesh3d[uuid];
        const obj = mesh2obj(mesh);
        obj.images instanceof Array && obj.images.map(function (img) {
            let uuid = img.uuid;
            Object.keys(images).map(function (key) {
                images[key] === img.url && (uuid = key);
            });
            obj.textures instanceof Array && obj.textures.map(function (texture) {
                texture.image === img.uuid && (texture.image = uuid);
            });
            images[uuid] = img.url;
        });
        delete obj.images;
        compressFloat(obj, store.compressMode);
        meshes[uuid] = obj;
    });

    // 导出灯光
    Object.keys(store.lights).map(uuid => {
        lights[uuid] = light2obj(store.lights[uuid]);
    });

    // 导出舞台配置
    const editor = deepCloneStore(store, [
        'timer', 'path',
        'mesh3d', 'lights',
        'selectedMesh', 'selectedVector', 'selectedVectorIndex', 'selectedLight'
    ].concat(Object.keys(config)));

    return {meshes, lights, images, editor};
}

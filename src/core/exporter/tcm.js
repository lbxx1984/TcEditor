/**
 * @file 将舞台导出为tcm文件
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(function (require) {


    const _ = require('underscore');
    const config = require('../../config');


    return function (model) {

        let store = model.store;

        let meshes = {};
        let lights = {};
        let images = {};
        let editor = {};

        // 导出物体
        _.each(store.mesh3d, function (mesh, uuid) {
            // 导出结构
            let obj = mesh2obj(mesh);
            let clone = JSON.stringify(obj);
            // 合并图片
            _.each(obj.images, function (image) {
                let key = findImagesInCatch(images, image.url);
                if (!key) {
                    images[image.uuid] = image.url;
                }
                else {
                    clone.replace(image.uuid, key);
                }
            });
            obj = JSON.parse(clone);
            delete obj.images;
            // 压缩模型
            compressFloat(obj, store.compressMode);
            meshes[uuid] = obj;
        });

        // 导出灯光
        _.each(store.lights, function (light, uuid) {
            lights[uuid] = light2obj(light);
        });

        // 导出舞台配置
        editor = deepCloneStore(store, [
            'timer', 'path',
            'mesh3d', 'lights',
            'selectedMesh', 'selectedVector', 'selectedVectorIndex', 'selectedLight'
        ].concat(_.keys(config)));

        return {meshes, lights, images, editor};
    };


    function mesh2obj(mesh) {
        let result = mesh.toJSON();
        result.tc = _.extend({}, mesh.tc);
        result.tc.birth = result.tc.birth.getTime();
        result.geometries[0].vertices = JSON.parse(JSON.stringify(mesh.geometry.vertices));
        result.materials[0].color = result.tc.materialColor;
        result.materials[0].emissive = result.tc.materialEmissive;
        return result;
    }


    function light2obj(light) {
        let result = light.toJSON();
        result.tc = _.extend({}, light.tc);
        return result;
    }

    function deepCloneStore(store, except) {
        let result = {};
        _.each(store, function (value, key) {
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

    function findImagesInCatch(images, base64) {
        let key = null;
        for (let k in images) {
            if (images.hasOwnProperty(k) && images[k] === base64) {
                key = k;
                break;
            }
        }
        return key;
    }

    function compressFloat(mesh, fixed) {
        if (fixed === 0) return;
        mesh.geometries.map(function (geo) {
            let newArr = [];
            geo.vertices.map(function (v) {
                newArr.push(1 * parseFloat(v.x).toFixed(fixed));
                newArr.push(1 * parseFloat(v.y).toFixed(fixed));
                newArr.push(1 * parseFloat(v.z).toFixed(fixed));
            });
            geo.vertices = newArr;
        });
    }

});
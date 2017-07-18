/**
 * @file 将舞台导出为tcm文件
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(function (require) {


    const _ = require('underscore');


    return function (model) {
        let meshes = {};
        _.each(model.store.mesh3d, function (mesh, key) {
            console.log(mesh2obj(mesh));
        });
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


});

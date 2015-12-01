define(function (require) {

    var editorDefaultConf = require('config/editorDefaultConf');

    /**
     * 材质转对象
     *
     * @param {Material} material 材质对象
     * @return {Object} 足够描述材质的对象
     */
    function material2object(material) {
        var result = material.toJSON();
        delete result.metadata;
        delete result.uuid;
        result.opacity = material.opacity;
        result.visible = material.visible;
        result.wireframe = material.wireframe;
        return result;
    }

    /**
     * 物体转对象
     *
     * @param {Geometry} geometry 3D物体对象
     * @return {Object} 足够描述物体的对象
     */
    function geometry2object(geometry) {
        var result = {};
        result.type = geometry.type;
        result.parameters = geometry.parameters;
        result.faces = [];
        for (var i = 0; i < geometry.faces.length; i++) {
            var face = geometry.faces[i];
            result.faces.push(face.a);
            result.faces.push(face.b);
            result.faces.push(face.c);
        }
        result.vertices = [];
        for (var i = 0; i < geometry.vertices.length; i++) {
            var vector = geometry.vertices[i];
            result.vertices.push(vector.x);
            result.vertices.push(vector.y);
            result.vertices.push(vector.z);
        }
        return result;
    }

    return {

        /**
         * 导出舞台配置
         *
         * @param {Object} me routing对象
         * @return {Object} 舞台配置
         */
        editorConf: function (me) {
            var result = editorDefaultConf;
            var stage = me.stage;
            result.grid = {
                size: stage.$3d.param.gridSize,
                visible: stage.$3d.param.showGrid
            };
            result.controlBar =  me.ui.refs.containerleft.refs.controlbar.state;
            return result;
        },

        /**
         * 将3D物体转换成Object
         *
         * @param {Object3D} mesh 待转换的3D物体
         * @return {Object} 标记还原物体最少信息的对象
         */
        mesh: function (mesh) {
            var result = {};
            result.type = mesh.type;
            result.name = mesh.name;
            result.birth = mesh.birth;
            result.locked = mesh.locked;
            result.visible = mesh.visible;
            result.material = material2object(mesh.material);
            result.material.color = mesh[window.editorKey].color;
            result.geometry = geometry2object(mesh.geometry);            
            result.matrix =[];
            for (var i = 0; i < mesh.matrix.elements.length; i++) {
                result.matrix.push(mesh.matrix.elements[i]);
            }
            return result;
        }
    };

});

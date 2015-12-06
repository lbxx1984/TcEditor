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
            result.group = mesh.group;
            result.visible = mesh.visible;
            result.material = material2object(mesh.material);
            result.material.color = mesh[window.editorKey].color;
            result.material.emissive = mesh[window.editorKey].emissive;
            result.geometry = geometry2object(mesh.geometry);
            result.matrix =[];
            for (var i = 0; i < mesh.matrix.elements.length; i++) {
                result.matrix.push(mesh.matrix.elements[i]);
            }
            return result;
        },

        /**
         * 导出camera配置
         *
         * @param {Object} stage 舞台对象
         * @return {Object} 摄像机参数配置
         */
        camera: function (stage) {
            return {
                a: parseInt(stage.cameraController.param.cameraAngleA),
                b: parseInt(stage.cameraController.param.cameraAngleB),
                r: parseInt(stage.$3d.param.cameraRadius),
                l: [
                    parseInt(stage.$3d.param.cameraLookAt.x),
                    parseInt(stage.$3d.param.cameraLookAt.y),
                    parseInt(stage.$3d.param.cameraLookAt.z)
                ],
                s: stage.$2d.param.scale,
                o: [
                    parseInt(stage.$2d.param.cameraLookAt.x),
                    parseInt(stage.$2d.param.cameraLookAt.y),
                ]
            };
        },

        /**
         * 将3D灯光对象转成Object
         * @param {THREE.light} light 待转换的3D灯光
         * @return {Object} 标记还原物体最少信息的对象
         */
        light: function (light) {
            var result = light.toJSON().object;
            result.birth = light.birth;
            result.locked = light.locked;
            result.visible = light.visible;
            delete result.uuid;
            return result;
        }
    };

});

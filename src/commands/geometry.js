/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var THREE = require('three');


    function isInvalidParam(param, dragging) {
        return !dragging
            || typeof param !== 'object'
            || Math.abs(param.cameraInfo.angleA) < 2
            || (param.mouseDelta3D.x === 0 && param.mouseDelta3D.y === 0 && param.mouseDelta3D.z === 0);
    }


    return {
        // 拖拽创建平面
        'geometry-plane': function (param, dragging) {
            if (isInvalidParam(param, dragging)) return;
            var stage = param.stage3D;
            var mouseDown3D = param.mouseDown3D;
            var mouseCurrent3D = param.mouseCurrent3D;
            if (stage.tempMesh) {
                stage.scene.remove(stage.tempMesh);
            }
            var width = Math.abs(mouseDown3D.x - mouseCurrent3D.x);
            var height = Math.abs(mouseDown3D.z - mouseCurrent3D.z);
            var material = new THREE.MeshPhongMaterial({
                color: 0xffffff, shading: THREE.FlatShading,
                side: THREE.DoubleSide
            });
            var geometry = new THREE.PlaneGeometry(width, height, 5, 5);
            stage.tempMesh = new THREE.Mesh(geometry, material);
            stage.tempMesh.rotation.x = -1.5 * Math.PI;
            stage.tempMesh.rotation.y = Math.PI;
            stage.tempMesh.position.set(
                (mouseDown3D.x + mouseCurrent3D.x) / 2,
                (mouseDown3D.y + mouseCurrent3D.y) / 2,
                (mouseDown3D.z + mouseCurrent3D.z) / 2
            );
            stage.scene.add(stage.tempMesh);
        }
    };


});

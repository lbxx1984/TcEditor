/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var THREE = require('three');


    return {
        // 拖拽创建平面
        'geometry-plane': function (param, dragging) {
            if (Math.abs(param.cameraInfo.angleA) < 2) return;
            var stage = param.stage3D;
            var mouseDown3D = param.mouseDown3D;
            var mouseCurrent3D = param.mouseCurrent3D;
            if (stage.tempMesh) {
                stage.scene.remove(stage.tempMesh);
            }
            var width = Math.abs(mouseDown3D.x - mouseCurrent3D.x);
            var height = Math.abs(mouseDown3D.z - mouseCurrent3D.z);
            var material = new THREE.MeshLambertMaterial({color: 0xe6e6e6, side: THREE.DoubleSide});
            var geometry = new THREE.PlaneGeometry(width, height, 5, 5);
            stage.tempMesh = new THREE.Mesh(geometry, material);
            stage.tempMesh.rotation.x = Math.PI / 2;
            stage.tempMesh.position.set(
                (mouseDown3D.x + mouseCurrent3D.x) / 2,
                (mouseDown3D.y + mouseCurrent3D.y) / 2,
                (mouseDown3D.z + mouseCurrent3D.z) / 2
            );
            stage.scene.add(stage.tempMesh);
        }
    };


});

/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    const _ = require('underscore');
    const THREE = require('three');
    const BASE_SEGMENT_SIZE = 100;


    function isInvalidParam(param, dragging) {
        return !dragging
            || typeof param !== 'object'
            || Math.abs(param.cameraInfo.angleA) < 2
            || (param.mouseDelta3D.x === 0 && param.mouseDelta3D.y === 0 && param.mouseDelta3D.z === 0);
    }


    function getDefaultMaterial() {
        return new THREE.MeshPhongMaterial({
            color: 0xffffff, shading: THREE.FlatShading,
            side: THREE.DoubleSide
        });
    }


    function getShadowSize(mouseDown3D, mouseCurrent3D) {
        let width = Math.abs(mouseDown3D.x - mouseCurrent3D.x);
        let height = Math.abs(mouseDown3D.z - mouseCurrent3D.z);
        return {width, height};
    }


    function getCenter(mouseDown3D, mouseCurrent3D) {
        let x = (mouseDown3D.x + mouseCurrent3D.x) / 2;
        let y = (mouseDown3D.y + mouseCurrent3D.y) / 2;
        let z = (mouseDown3D.z + mouseCurrent3D.z) / 2;
        return {x, y, z};
    }


    function getDistance(mouseDown3D, mouseCurrent3D) {
        let dx = mouseDown3D.x - mouseCurrent3D.x;
        let dy = mouseDown3D.y - mouseCurrent3D.y;
        let dz = mouseDown3D.z - mouseCurrent3D.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }


    return {


        // 拖拽创建平面
        'geometry-plane'(param, dragging) {
            if (isInvalidParam(param, dragging)) return;
            let stage = param.stage3D;
            let size = getShadowSize(param.mouseDown3D, param.mouseCurrent3D);
            let center = getCenter(param.mouseDown3D, param.mouseCurrent3D);
            let material = getDefaultMaterial();
            if (stage.tempMesh) stage.scene.remove(stage.tempMesh);
            
            let segmentWidth = parseInt(size.width / BASE_SEGMENT_SIZE, 10);
            let segmentHeight = parseInt(size.height / BASE_SEGMENT_SIZE, 10);
            let geometry = new THREE.PlaneGeometry(size.width, size.height, segmentWidth, segmentHeight);
            stage.tempMesh = new THREE.Mesh(geometry, material);
            stage.tempMesh.rotation.x = -1.5 * Math.PI;
            stage.tempMesh.rotation.y = Math.PI;
            stage.tempMesh.position.set(center.x, center.y, center.z);
            stage.scene.add(stage.tempMesh);
        },


        'geometry-sphere'(param, dragging) {
            if (isInvalidParam(param, dragging)) return;
            let stage = param.stage3D;
            let distance = getDistance(param.mouseDown3D, param.mouseCurrent3D);
            let center = getCenter(param.mouseDown3D, param.mouseCurrent3D);
            let material = getDefaultMaterial();
            if (stage.tempMesh) stage.scene.remove(stage.tempMesh);

            let geometry = new THREE.SphereGeometry(distance / 2, 20, 10);
            stage.tempMesh = new THREE.Mesh(geometry, material);
            stage.tempMesh.position.set(center.x, center.y, center.z);
            stage.scene.add(stage.tempMesh);
        }
    };


});

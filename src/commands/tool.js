/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var THREE = require('three');
    var config = require('../config');
    var intersected = null;


    function clearIntersectedColor(obj, selected) {
        var color = selected && selected.uuid === obj.uuid ? config.colors.selectedMesh[0] : obj.tc.materialColor;
        obj.material.setValues({color: color});
    }

    function clearMeshColor(mesh) {
        if (!mesh) return;
        mesh.material.setValues({color: mesh.tc.materialColor});
    }

    function getMeshByMouse3D(x, y, stage) {
        var vector = new THREE.Vector3(
            (x / stage.refs.container.offsetWidth) * 2 - 1,
            -(y / stage.refs.container.offsetHeight) * 2 + 1,
            1
        );
        vector.unproject(stage.camera);
        stage.raycaster.ray.set(stage.camera.position, vector.sub(stage.camera.position).normalize());
        var intersects = stage.raycaster.intersectObjects(stage.meshArray || []);
        return intersects.length ? intersects[0].object : null;
    }

    function hoverMeshByMouse3d(param, selectedMesh) {
        var obj = getMeshByMouse3D(param.event.nativeEvent.offsetX, param.event.nativeEvent.offsetY, param.stage3D);
        if (obj) {
            if (intersected) clearIntersectedColor(intersected, selectedMesh);
            intersected = obj;
            intersected.material.setValues({color: config.colors.normalMeshHover[0]});
        }
        else if (intersected) {
            clearIntersectedColor(intersected, selectedMesh);
            intersected = null;
        }
    }

    function pickupMesh(selectedMesh, me) {
        if (selectedMesh && selectedMesh.uuid === intersected.uuid) return;
        clearMeshColor(selectedMesh);
        intersected.material.setValues({color: config.colors.selectedMesh[0]});
        me.set('selectedMesh', intersected);
    }

    function initTools(selectedMesh, me, param) {
        clearMeshColor(selectedMesh);
        me.fill(param);
        return;
    }


    return {
        'tool-pickGeometry': function (param, dragging) {
            var selectedMesh = this.get('selectedMesh');
            // 初始化工具
            if (this.get('tool') !== 'tool-pickGeometry') {
                initTools(selectedMesh, this, {
                    tool: 'tool-pickGeometry',
                    selectedMesh: null
                });
                return;
            }
            // 拾取物体
            if (param === 'mouseup' && intersected) {
                pickupMesh(selectedMesh, this);
                return;
            }
            // 拖拽容忍
            if (typeof param !== 'object' || dragging) return;
            // hover物体
            hoverMeshByMouse3d(param, selectedMesh);
        },
        'tool-pickJoint': function (param, dragging) {
            var selectedMesh = this.get('selectedMesh');
            var selectedVector = this.get('selectedVector');
            // 初始化工具
            if (this.get('tool') !== 'tool-pickJoint') {
                initTools(selectedMesh, this, {
                    tool: 'tool-pickJoint',
                    selectedMesh: null,
                    selectedVector: null
                });
                return;
            }
            // 拾取物体
            if (param === 'mouseup' && intersected) {
                pickupMesh(selectedMesh, this);
                return;
            }
            // 拖拽容忍
            if (typeof param !== 'object' || dragging) return;
            // hover物体
            if (selectedMesh == null) {
                hoverMeshByMouse3d(param, selectedMesh);
                return;
            }
        }
    };


});

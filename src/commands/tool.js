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


    function clearIntersectedColor(obj, selected) {
        var color = selected && selected.uuid === obj.uuid ? config.colors.selectedMesh[0] : obj.tc.materialColor;
        obj.material.setValues({color: color});
    }


    return {
        'tool-pickGeometry': function (param, dragging) {
            if (this.get('tool') !== 'tool-pickGeometry') {
                var selectedMesh = this.get('selectedMesh');
                if (selectedMesh) {
                    selectedMesh.material.setValues({color: selectedMesh.tc.materialColor});
                }
                this.fill({
                    tool: 'tool-pickGeometry',
                    selectedMesh: null
                });
                return;
            }
            var lastSelected = this.get('selectedMesh');
            // 拾取物体
            if (param === 'mouseup' && intersected) {
                if (lastSelected && lastSelected.uuid === intersected.uuid) return;
                if (lastSelected) {
                    lastSelected.material.setValues({color: lastSelected.tc.materialColor});
                }
                intersected.material.setValues({color: config.colors.selectedMesh[0]});
                this.set('selectedMesh', intersected);
                return;
            }
            if (typeof param !== 'object' || dragging) return;
            // hover物体
            var obj = getMeshByMouse3D(param.event.nativeEvent.offsetX, param.event.nativeEvent.offsetY, param.stage3D);
            if (obj) {
                if (intersected) clearIntersectedColor(intersected, lastSelected);
                intersected = obj;
                intersected.material.setValues({color: config.colors.normalMeshHover[0]});
            }
            else if (intersected) {
                clearIntersectedColor(intersected, lastSelected);
                intersected = null;
            }
        }
    };


});

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
    var intersectedVector = null;


    function clearIntersectedColor(obj, selected) {
        if (!obj) return;
        var color = selected && selected.uuid === obj.uuid ? config.colors.selectedMesh[0] : obj.tc.materialColor;
        obj.material.setValues({color: color});
    }

    function clearObject3dColor(mesh) {
        if (!mesh) return;
        mesh.material.setValues({color: mesh.tc.materialColor});
    }

    function getObject3dByMouse3D(x, y, stage, meshes) {
        var vector = new THREE.Vector3(
            (x / stage.refs.container.offsetWidth) * 2 - 1,
            -(y / stage.refs.container.offsetHeight) * 2 + 1,
            1
        );
        vector.unproject(stage.camera);
        stage.raycaster.ray.set(stage.camera.position, vector.sub(stage.camera.position).normalize());
        var intersects = stage.raycaster.intersectObjects(meshes || []);
        return intersects.length ? intersects[0].object : null;
    }

    function hoverMeshByMouse3d(param, selectedMesh, targetMeshes) {
        var obj = getObject3dByMouse3D(
            param.event.nativeEvent.offsetX,
            param.event.nativeEvent.offsetY,
            param.stage3D,
            targetMeshes ? targetMeshes : param.stage3D.meshArray
        );
        if (obj) {
            if (obj.tc.locked) return;
            if (selectedMesh && obj.uuid === selectedMesh.uuid) return;
            clearIntersectedColor(intersected, selectedMesh);
            intersected = obj;
            intersected.material.setValues({color: config.colors.normalMeshHover[0]});
        }
        else if (intersected) {
            clearIntersectedColor(intersected, selectedMesh);
            intersected = null;
        }
    }

    function hoverMeshByMouse2d(param, selectedMesh) {
        var mouse2d = param.mouseCurrent2D;
        var obj = param.stage2D.renderer2D.getObject2dByMouse2D(mouse2d.x, mouse2d.y);
        if (obj) {
            if (obj.tc.locked) return;
            if (selectedMesh && obj.uuid === selectedMesh.uuid) return;
            clearIntersectedColor(intersected, selectedMesh);
            intersected = obj;
            intersected.material.setValues({color: config.colors.normalMeshHover[0]});
        }
        else if(intersected) {
            clearIntersectedColor(intersected, selectedMesh);
            intersected = null;
        }
    }

    function hoverVectorByMouse3d(param, selectedVector, selectedMesh) {
        var obj = getObject3dByMouse3D(
            param.event.nativeEvent.offsetX,
            param.event.nativeEvent.offsetY,
            param.stage3D,
            param.stage3D.morpher.anchors
        );
        if (obj) {
            clearIntersectedColor(intersected, selectedMesh);
            clearIntersectedColor(intersectedVector, selectedVector);
            intersectedVector = obj;
            intersectedVector.material.setValues({color: config.colors.normalMeshHover[0]});
        }
        else if (intersectedVector) {
            clearIntersectedColor(intersectedVector, selectedVector);
            intersectedVector = null;
        }
    }

    function pickupMesh(selectedMesh, me) {
        if (selectedMesh && selectedMesh.uuid === intersected.uuid) return;
        clearObject3dColor(selectedMesh);
        clearObject3dColor(me.get('selectedVector'));
        intersected.material.setValues({color: config.colors.selectedMesh[0]});
        me.fill({
            selectedMesh: intersected,
            morpher3Dinfo: _.extend({}, me.get('morpher3Dinfo'), {
                anchorColor: intersected.tc.anchorColor
            }),
            selectedVector: null,
            selectedVectorIndex: -1
        });
    }

    function pickupVector(selectedVector, me) {
        if (selectedVector && selectedVector.uuid === intersectedVector.uuid) return;
        clearObject3dColor(selectedVector);
        intersectedVector.material.setValues({color: config.colors.selectedMesh[0]});
        me.fill({
            selectedVector: intersectedVector,
            selectedVectorIndex: intersectedVector.tc.index
        });
    }

    function pickupLight(selectedLight, me) {
        if (selectedLight && selectedLight.uuid === intersected.uuid) return;
        clearObject3dColor(selectedLight);
        if (intersected && intersected.tc.lightKey) {
            var light = me.get('lights')[intersected.tc.lightKey];
            if (!light || !light.visible || light.tc.locked) {
                return
            }
        }
        me.fill({
            selectedLight: intersected,
        });
    }


    return {
        'tool-select-mesh-by-uuid': function (uuid) {
            var selectedMesh = this.get('selectedMesh');
            var mesh = this.get('mesh3d')[uuid];
            if (!mesh || mesh.tc.locked || !mesh.visible) return;
            if (selectedMesh && selectedMesh.uuid === uuid) return;
            clearObject3dColor(selectedMesh);
            clearObject3dColor(this.get('selectedVector'));
            mesh.material.setValues({color: config.colors.selectedMesh[0]});
            this.fill({
                selectedMesh: mesh,
                selectedVector: null,
                selectedVectorIndex: -1
            });
        },
        'tool-pickGeometry': function (param, dragging) {
            var selectedMesh = this.get('selectedMesh');
            // 初始化工具
            if (this.get('tool') !== 'tool-pickGeometry') {
                this.fill({
                    tool: 'tool-pickGeometry',
                    selectedVector: null,
                    selectedVectorIndex: -1
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
        'tool-pickGeometry-2d': function (param, dragging) {
            var selectedMesh = this.get('selectedMesh');
            // 拾取物体
            if (param === 'mouseup' && intersected) {
                pickupMesh(selectedMesh, this);
                return;
            }
            // 拖拽容忍
            if (typeof param !== 'object' || dragging) return;
            // hover物体
            hoverMeshByMouse2d(param, selectedMesh);
        },
        'tool-pickJoint': function (param, dragging) {
            var selectedMesh = this.get('selectedMesh');
            var selectedVector = this.get('selectedVector');
            // 初始化工具
            if (this.get('tool') !== 'tool-pickJoint') {
                this.fill({
                    tool: 'tool-pickJoint',
                    selectedVector: null,
                    selectedVectorIndex: -1
                });
                return;
            }
            // 拾取物体拾取关节
            if (param === 'mouseup' && intersectedVector) {
                pickupVector(selectedVector, this);
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
            // hover关节
            if (selectedMesh != null) {
                hoverVectorByMouse3d(param, selectedVector, selectedMesh);
                if (intersectedVector) return;
                hoverMeshByMouse3d(param, selectedMesh);
                return;
            }
        },
        'tool-pickJoint-2d': function (param, dragging) {
            var selectedMesh = this.get('selectedMesh');
            // 拾取物体
            if (param === 'mouseup' && intersected) {
                pickupMesh(selectedMesh, this);
                return;
            }
            // 拖拽容忍
            if (typeof param !== 'object' || dragging) return;
            // hover物体
            hoverMeshByMouse2d(param, selectedMesh);
        },
        'tool-select-light-by-key': function (key, anchor) {
            var dataset = {
                selectedLight: null
            };
            var light = this.get('lights')[key];
            if (anchor) {
                dataset.selectedLight = anchor;
            }
            else if (light && light.visible && !light.tc.locked) {
                dataset.selectedLight = key;
            }
            dataset.selectedLight && this.fill(dataset);
        },
        'tool-pickLight': function (param, dragging) {
            var selectedLight = this.get('selectedLight');
            // 初始化工具
            if (this.get('tool') !== 'tool-pickLight') {
                clearObject3dColor(this.get('selectedMesh'));
                clearObject3dColor(this.get('selectedVector'));
                if (selectedLight && selectedLight.tc) {
                    selectedLight = selectedLight.tc.lightKey;
                }
                this.fill({
                    tool: 'tool-pickLight',
                    selectedMesh: null,
                    selectedVector: null,
                    selectedVectorIndex: -1,
                    selectedLight: typeof selectedLight === 'string' ? selectedLight : null
                });
                return;
            }
            // 拾取物体
            if (param === 'mouseup' && intersected) {
                pickupLight(selectedLight, this);
                return;
            }
            // 拖拽容忍
            if (typeof param !== 'object' || dragging) return;
            // hover物体
            hoverMeshByMouse3d(param, null, param.stage3D.lightHelper.anchorArray);
        }
    };


});

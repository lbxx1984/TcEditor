/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');

    function clearObject3dColor(mesh) {
        if (!mesh) return;
        mesh.material.setValues({color: mesh.tc.materialColor});
    }

    return {
        // update timer
        updateTimer: function () {
            this.set('timer', new Date().getTime());
        },
        // 修改3D摄像机
        changeCamera3D: function (param) {
            var stage = _.extend({}, this.get('stage'));
            stage.camera3D = _.extend({}, stage.camera3D, param);
            this.set('stage', stage);
        },
        // 修改3D鼠标
        changeMouse3D: function (point) {
            this.set('mouse3d', point);
        },
        // 修改系统工具集
        changeSystemTool: function (value) {
            var selectedMesh = this.get('selectedMesh');
            if (selectedMesh) {
                selectedMesh.material.setValues({color: selectedMesh.tc.materialColor});
            }
            var view = value.indexOf('geometry-') === 0 && this.get('view') !== 'view-all'
                ? 'view-3d' : this.get('view');
            var stage = _.extend({}, this.get('stage'));
            stage.camera3D = _.extend({}, stage.camera3D);
            stage.camera3D.cameraAngleA = value.indexOf('geometry-') === 0 && Math.abs(stage.camera3D.cameraAngleA) < 2
                ? 40 : stage.camera3D.cameraAngleA;
            this.fill({
                tool: value,
                view: view,
                stage: stage,
                selectedMesh: null
            });
        },
        // 修改系统操作面板状态
        changePanelConfig: function (value) {
            var panel = value.split('-')[1];
            var arr = [];
            var have = false;
            this.get('panel').map(function (item) {
                if (item.type !== panel) {
                    arr.push(item);
                    return;
                }
                have = true;
            });
            if (!have) {
                arr.push({type: panel, expend: true});
            }
            this.set('panel', arr);
        },
        // 修改物体的分组
        changeMeshGroup: function (uuid, group) {
            var mesh = this.get('mesh3d')[uuid];
            if (!mesh) return;
            mesh.tc.group = group;
            this.set('timer', +new Date());
        },
        // 锁定物体
        lockMesh: function (uuid) {
            var dataset = {
                timer: +new Date()
            };
            var mesh = this.get('mesh3d')[uuid];
            if (!mesh) return;
            mesh.tc.locked = !mesh.tc.locked;
            var selectedMesh = this.get('selectedMesh');
            if (selectedMesh && selectedMesh.uuid === uuid) {
                clearObject3dColor(selectedMesh);
                dataset.selectedMesh = null;
                dataset.selectedVector = null;
                dataset.selectedVectorIndex = -1;
            }
            this.fill(dataset);
        },
        // 删除物体
        deleteMesh: function (uuid) {
            var mesh3d = _.extend({}, this.get('mesh3d'));
            var selectedMesh = this.get('selectedMesh');
            var dataset = {
                mesh3d: mesh3d
            };
            delete mesh3d[uuid];
            if (selectedMesh && selectedMesh.uuid === uuid) {
                dataset.selectedMesh = null;
                dataset.selectedVector = null;
                dataset.selectedVectorIndex = -1;
            }
            this.fill(dataset);
        },
        // 添加物体
        addMesh: function (obj3D) {
            var hash = _.extend({}, this.get('mesh3d'));
            obj3D.tc = {
                birth: new Date(),
                add: true,
                anchorColor: 0x00CD00,
                materialColor: obj3D.material.color.getHex(),
                materialEmissive: obj3D.material.emissive.getHex()
            };
            hash[obj3D.uuid] = obj3D;
            this.set('mesh3d', hash);
        }
    };


});

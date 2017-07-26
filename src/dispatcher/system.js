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

    function isOperatingSelectedLight(key, me) {
        var selectedLight = me.get('selectedLight');
        if (typeof selectedLight === 'string' && selectedLight === key) {
            return true;
        }
        if (selectedLight && selectedLight.tc && selectedLight.tc.lightKey === key) {
            return true;
        }
        return false;
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
        // 修改激活分组
        changeActiveGroup: function (group) {
            this.set('activeGroup', group);
        },
        // 显示物体
        visibleMesh: function (uuid) {
            var dataset = {
                timer: +new Date()
            };
            var mesh = this.get('mesh3d')[uuid];
            if (!mesh) return;
            mesh.visible = !mesh.visible;
            var selectedMesh = this.get('selectedMesh');
            if (selectedMesh && selectedMesh.uuid === uuid) {
                clearObject3dColor(selectedMesh);
                dataset.selectedMesh = null;
                dataset.selectedVector = null;
                dataset.selectedVectorIndex = -1;
            }
            this.fill(dataset);
        },
        // 显示分组
        visibleGroup: function (groupId, visible) {
            var dataset = {
                timer: +new Date()
            };
            var selectedMesh = this.get('selectedMesh');
            _.each(this.get('mesh3d'), function (mesh) {
                if (mesh.tc.group !== groupId) return;
                mesh.visible = visible;
                if (selectedMesh && selectedMesh.uuid === mesh.uuid) {
                    clearObject3dColor(selectedMesh);
                    dataset.selectedMesh = null;
                    dataset.selectedVector = null;
                    dataset.selectedVectorIndex = -1;
                }
            });
            this.fill(dataset);
        },
        // 显示灯光
        visibleLight: function (key) {
            var dataset = {
                timer: +new Date()
            };
            var light = this.get('lights')[key];
            if (!light) return;
            light.visible = !light.visible;
            if (isOperatingSelectedLight(key, this)) {
                dataset.selectedLight = null;
            }
            this.fill(dataset);
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
        // 锁定分组
        lockGroup: function (groupId, locked) {
            var dataset = {
                timer: +new Date()
            };
            var selectedMesh = this.get('selectedMesh');
            _.each(this.get('mesh3d'), function (mesh) {
                if (mesh.tc.group !== groupId) return;
                mesh.tc.locked = locked;
                if (selectedMesh && selectedMesh.uuid === mesh.uuid) {
                    clearObject3dColor(selectedMesh);
                    dataset.selectedMesh = null;
                    dataset.selectedVector = null;
                    dataset.selectedVectorIndex = -1;
                }
            });
            this.fill(dataset);
        },
        // 锁定灯光
        lockLight: function (key) {
            var dataset = {
                timer: +new Date()
            };
            var light = this.get('lights')[key];
            if (!light) return;
            light.tc.locked = !light.tc.locked;
            if (isOperatingSelectedLight(key, this)) {
                dataset.selectedLight = null;
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
        // 删除分组
        deleteGroup: function (groupId, removeMesh) {
            var group = [];
            var meshes = _.extend({}, this.get('mesh3d'));
            var selectedMesh = this.get('selectedMesh');
            var dataset = {
                group: group,
                mesh3d: meshes,
                activeGroup: 'default group',
                timer: +new Date()
            };
            this.get('group').map(function (item) {
                if (item.label === groupId) return;
                group.push(item);
            });
            _.each(meshes, function (mesh, key) {
                if (mesh.tc.group !== groupId) return;
                if (!removeMesh || mesh.tc.locked) {
                    mesh.tc.group = 'default group';
                    return;
                }
                delete meshes[key];
                if (selectedMesh && selectedMesh.uuid === key) {
                    dataset.selectedMesh = null;
                    dataset.selectedVector = null;
                    dataset.selectedVectorIndex = -1;
                }
            });
            this.fill(dataset);
        },
        // 删除灯光
        deleteLight: function (key) {
            var light = this.get('lights')[key];
            if (!light) return;
            var lights = _.extend({}, this.get('lights'));
            var dataset = {
                lights: lights
            };
            delete lights[key];
            if (isOperatingSelectedLight(key, this)) {
                dataset.selectedLight = null;
            }
            this.fill(dataset);
        },
        // 添加物体
        addMesh: function (obj3D) {
            var hash = _.extend({}, this.get('mesh3d'));
            obj3D.tc = {
                birth: new Date(),
                add: true,
                group: this.get('activeGroup'),
                anchorColor: 0x00CD00,
                materialColor: obj3D.material.color.getHex(),
                materialEmissive: obj3D.material.emissive.getHex()
            };
            hash[obj3D.uuid] = obj3D;
            this.set('mesh3d', hash);
        },
        // 创建分组
        addGroup: function (groupname) {
            this.fill({
                group: [].concat(this.get('group'), [
                    {label: groupname, expend: true}
                ]),
                activeGroup: groupname
            });
        },
        // 重命名分组
        renameGroup: function (groupId, newId) {
            var group = JSON.parse(JSON.stringify(this.get('group')));
            _.each(this.get('mesh3d'), function (mesh) {
                mesh.tc.group = mesh.tc.group === groupId ? newId : mesh.tc.group;
            });
            group.map(function (item) {
                item.label = item.label === groupId ? newId : item.label;
            });
            this.fill({
                group: group,
                activeGroup: newId
            });
        }
    };


});

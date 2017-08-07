/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    const _ = require('underscore');
    const Dialog = require('fcui2/Dialog.jsx');
    const hotkey = require('../core/hotkey');
    const math = require('../core/math');
    const dialog = new Dialog();


    function clearObject3dColor(mesh) {
        if (!mesh) return;
        mesh.material.setValues({
            color: mesh.tc.materialColor,
            opacity: mesh.tc.materialOpacity
        });
    }


    function isOperatingSelectedLight(key, me) {
        let selectedLight = me.get('selectedLight');
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
        updateTimer() {
            this.set('timer', new Date().getTime());
        },


        // 修改3D摄像机
        changeCamera3D(param) {
            let stage = _.extend({}, this.get('stage'));
            stage.camera3D = _.extend({}, stage.camera3D, param);
            this.set('stage', stage);
        },


        // 修改3D鼠标
        changeMouse3D(point) {
            this.set('mouse3d', point);
        },


        // 修改系统工具集
        changeSystemTool(value) {
            let selectedMesh = this.get('selectedMesh');
            if (selectedMesh) {
                selectedMesh.material.setValues({color: selectedMesh.tc.materialColor});
            }
            let view = value.indexOf('geometry-') === 0 && this.get('view') !== 'view-all'
                ? 'view-3d' : this.get('view');
            let stage = _.extend({}, this.get('stage'));
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
        changePanelConfig(value) {
            let panel = value.split('-')[1];
            let arr = [];
            let have = false;
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
        changeMeshGroup(uuid, group) {
            let mesh = this.get('mesh3d')[uuid];
            if (!mesh) return;
            mesh.tc.group = group;
            this.set('timer', +new Date());
        },


        // 修改激活分组
        changeActiveGroup(group) {
            this.set('activeGroup', group);
        },


        // 显示物体
        visibleMesh(uuid) {
            let dataset = {
                timer: +new Date()
            };
            let mesh = this.get('mesh3d')[uuid];
            if (!mesh) return;
            mesh.visible = !mesh.visible;
            let selectedMesh = this.get('selectedMesh');
            if (selectedMesh && selectedMesh.uuid === uuid) {
                clearObject3dColor(selectedMesh);
                dataset.selectedMesh = null;
                dataset.selectedVector = null;
                dataset.selectedVectorIndex = -1;
            }
            this.fill(dataset);
        },


        // 显示分组
        visibleGroup(groupId, visible) {
            let dataset = {
                timer: +new Date()
            };
            let selectedMesh = this.get('selectedMesh');
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
        visibleLight(key) {
            let dataset = {
                timer: +new Date()
            };
            let light = this.get('lights')[key];
            if (!light) return;
            light.visible = !light.visible;
            if (isOperatingSelectedLight(key, this)) {
                dataset.selectedLight = null;
            }
            this.fill(dataset);
        },


        // 锁定物体
        lockMesh(uuid) {
            let dataset = {
                timer: +new Date()
            };
            let mesh = this.get('mesh3d')[uuid];
            if (!mesh) return;
            mesh.tc.locked = !mesh.tc.locked;
            let selectedMesh = this.get('selectedMesh');
            if (selectedMesh && selectedMesh.uuid === uuid) {
                clearObject3dColor(selectedMesh);
                dataset.selectedMesh = null;
                dataset.selectedVector = null;
                dataset.selectedVectorIndex = -1;
            }
            this.fill(dataset);
        },


        // 锁定分组
        lockGroup(groupId, locked) {
            let dataset = {
                timer: +new Date()
            };
            let selectedMesh = this.get('selectedMesh');
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
        lockLight(key) {
            let dataset = {
                timer: +new Date()
            };
            let light = this.get('lights')[key];
            if (!light) return;
            light.tc.locked = !light.tc.locked;
            if (isOperatingSelectedLight(key, this)) {
                dataset.selectedLight = null;
            }
            this.fill(dataset);
        },


        // 删除物体
        deleteMesh(uuid) {
            let me = this;
            dialog.confirm({
                title: 'Please Confirm',
                message: '<h4>Are you sure to remove this mesh?</h4>',
                appSkin: 'oneux3',
                labels: {
                    enter: 'Yes',
                    cancel: 'No'
                },
                onClose: () => hotkey.un('enter', run),
                onEnter: () => run()
            });
            hotkey.on('enter', run);
            function run() {
                dialog.close();
                hotkey.un('enter', run);
                let mesh3d = _.extend({}, me.get('mesh3d'));
                let selectedMesh = me.get('selectedMesh');
                let dataset = {mesh3d: mesh3d};
                delete mesh3d[uuid];
                if (selectedMesh && selectedMesh.uuid === uuid) {
                    dataset.selectedMesh = null;
                    dataset.selectedVector = null;
                    dataset.selectedVectorIndex = -1;
                }
                me.fill(dataset);
            }
        },


        // 删除分组
        deleteGroup(groupId, removeMesh) {
            let group = [];
            let meshes = _.extend({}, this.get('mesh3d'));
            let selectedMesh = this.get('selectedMesh');
            let dataset = {
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
        deleteLight(key) {
            let light = this.get('lights')[key];
            if (!light) return;
            let lights = _.extend({}, this.get('lights'));
            let dataset = {
                lights: lights
            };
            delete lights[key];
            if (isOperatingSelectedLight(key, this)) {
                dataset.selectedLight = null;
            }
            this.fill(dataset);
        },


        // 添加物体
        addMesh(obj3D) {
            let hash = _.extend({}, this.get('mesh3d'));
            obj3D.tc = {
                birth: new Date(),
                add: true,
                group: this.get('activeGroup'),
                anchorColor: 0x00CD00,
                materialColor: obj3D.material.color.getHex(),
                materialEmissive: obj3D.material.emissive.getHex(),
                materialOpacity: obj3D.material.opacity,
                vectorLinkHash: math.getVectorLinkHash(obj3D.geometry)
            };
            hash[obj3D.uuid] = obj3D;
            this.set('mesh3d', hash);
        },


        // 创建分组
        addGroup(groupname) {
            this.fill({
                group: [].concat(this.get('group'), [
                    {label: groupname, expend: true}
                ]),
                activeGroup: groupname
            });
        },


        // 重命名分组
        renameGroup(groupId, newId) {
            let group = JSON.parse(JSON.stringify(this.get('group')));
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

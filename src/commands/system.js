/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');


    return {
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
            this.set('tool', value);
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
        // 添加物体
        addMesh: function (obj3D) {
            var hash = _.extend({}, this.get('mesh3d'));
            obj3D.tc = {
                birth: new Date(),
                add: true
            };
            hash[obj3D.uuid] = obj3D;
            this.set('mesh3d', hash);
        }
    };


});

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
        // 推进摄像机
        'camera-zoomIn': function () {
            var stage = _.extend({}, this.get('stage'));
            var radius = stage.camera3D.cameraRadius;
            radius = radius - 0.2 * radius * 240 / document.body.offsetWidth;
            radius = Math.max(radius, 50);
            radius = Math.min(radius, 5000);
            stage.camera3D = _.extend({}, stage.camera3D, {cameraRadius: radius});
            this.set('stage', stage);
        },
        // 推远摄像机
        'camera-zoomOut': function () {
            var stage = _.extend({}, this.get('stage'));
            var radius = stage.camera3D.cameraRadius;
            radius = radius + 0.2 * radius * 240 / document.body.offsetWidth;
            radius = Math.max(radius, 50);
            radius = Math.min(radius, 5000);
            stage.camera3D = _.extend({}, stage.camera3D, {cameraRadius: radius});
            this.set('stage', stage);
        },
        // 扩展坐标纸
        'stage-enlargeGrid': function () {
            var stage = _.extend({}, this.get('stage'));
            stage.gridSize3D = Math.min(stage.gridSize3D + 1000, 20000);
            stage.gridStep3D = stage.gridSize3D / 50;
            this.set('stage', stage);
        },
        // 收缩坐标纸
        'stage-narrowGrid': function () {
            var stage = _.extend({}, this.get('stage'));
            stage.gridSize3D = Math.max(stage.gridSize3D - 1000, 1000);
            stage.gridStep3D = stage.gridSize3D / 50;
            this.set('stage', stage);
        },
        // 隐藏舞台辅助器
        'stage-helperVisible': function () {
            var stage = _.extend({}, this.get('stage'));
            stage.gridVisible = !stage.gridVisible;
            this.set('stage', stage);
        }
    };


});

/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');


    return {
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
        },
        // 点击了3D舞台右键菜单
        'stage3d-context-menu': function (stage3d) {
            if (this.get('tool') === 'tool-pickGeometry' && this.get('selectedMesh')) {
                var selectedMesh = this.get('selectedMesh');
                selectedMesh.material.setValues({color: selectedMesh.tc.materialColor});
                this.set('selectedMesh', null);
            }
        }
    };


});

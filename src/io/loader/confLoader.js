/**
 * 负责载入编辑器内部配置
 */
define(function (require) {

    var object2three = require('../util/object2three');

    function loader(data, callback) {
        var me = this;
        var stage3d = me.stage.$3d;
        var controlBar = me.ui.refs.containerleft.refs.controlbar;
        var light = object2three.light(data.defaultLight);
        me.light.add(light);
        stage3d.param.gridSize = data.grid.size;
        stage3d.resizeGrid(true);
        stage3d.resizeGrid(false);
        if (data.grid.visible === false) {
            me.stage.callFunction('toggleHelper');
            var btn = controlBar.getDOMNode().getElementsByClassName('icon-kejian');
            btn[0].dataset.uiValue = 1;
            btn[0].className = btn[0].className.replace('icon-kejian', 'icon-bukejian');
        }
        // 由于鼠标引擎是异步加载的，这里hack一下
        setTimeout(function () {
            me.main('view-' + data.controlBar.cameraview);
            me.main('mouse-' + data.controlBar.systemtool);
            callback(true);
        }, 200);
    }

    return loader;
});

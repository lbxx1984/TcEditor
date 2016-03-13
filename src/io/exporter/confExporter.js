/**
 * 负责导出编辑器内部配置
 */
define(function (require) {

    var editorDefaultConf = require('config/editorDefaultConf');

    function exporter() {
        var result = editorDefaultConf;
        result.grid = {
            size: this.stage.$3d.param.gridSize,
            visible: this.stage.$3d.param.showGrid
        };
        result.controlBar =  this.ui.refs.containerleft.refs.controlbar.state;
        return result;
    }

    return exporter;
});

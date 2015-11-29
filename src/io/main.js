define(function (require) {

    var exporter = require('./exporter');
    var importer = require('./importer');

    /**
     * 压缩模型对象
     *
     * @param {Object} obj 模型对象
     * @param {number} fixed 保留的小数点位数
     */
    function compress(obj, fixed) {
        for (var key in obj) {
            if (typeof obj[key] === 'string') {
                continue;
            }
            if (obj[key] instanceof Array) {
                var arr = obj[key];
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = compressNumber(arr[i]);
                }
                continue;
            }
            if (typeof obj[key] === 'number') {
                obj[key] = compressNumber(obj[key]);
            }
            if (typeof obj[key] === 'object') {
                compress(obj[key], fixed);
                continue;
            }
        }
        function compressNumber(a) {
            return a.toString().indexOf('.') > -1 ? parseFloat(a.toFixed(fixed)) : a;
        }
    }

    /**
     * io系统，负责保存打开所有文件，以及文件解析
     *
     * @param {Object} param 配置参数
     * @param {Object} param.routing 全局控制路由
     */
    function IO(param) {
        this.routing = param.routing;
    }

    /**
     * 获取编辑器配置
     *
     * @return {string} 编辑器配置
     */
    IO.prototype.getEditorConf = function () {
        return JSON.stringify(exporter.editorConf(this.routing));
    };

    /**
     * 解析编辑配置
     *
     * @param {Object} conf 编辑器级别配置
     */
    IO.prototype.setEditorConf = function (conf) {
        importer.editorConf(this.routing, conf);
    };

    /**
     * 获取舞台中物体
     *
     * @return {Array.<Object>} 舞台物体队列
     */
    IO.prototype.getMeshes = function () {
        var result = [];
        var children = this.routing.stage.$3d.children;
        for (var key in children) {
            var mesh = exporter.mesh(children[key]);
            compress(mesh, 2);
            result.push(mesh);
        }
        return result;
    };

    /**
     * 获取舞台中灯光
     *
     * @return {Array.<Object>} 舞台灯光队列
     */
    IO.prototype.getLights = function () {
        var lights = this.routing.light.children;
        var result = [];
        for (var key in lights) {
            var obj = lights[key].toJSON().object;
            delete obj.uuid;
            compress(obj, 2);
            result.push(obj);
        }
        return result;
    };

    return IO;
});

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
     * 导入物体到舞台
     *
     * @param {Array.<Object>} meshes 本Editor导出的物体对象队列
     */
    IO.prototype.setMeshes = function (meshes) {
        var routing = this.routing;
        for (var i = 0; i < meshes.length; i++) {
            var mesh = importer.mesh(meshes[i]);
        }
        showMeshes();
        function showMeshes() {
            if (routing.ui == null) {
                setTimeout(showMeshes, 10);
                return;
            }
            routing.ui.refs.containerright.refs.verticallist.refs.meshBox.setState({
                meshes: routing.stage.$3d.children
            });
        }
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

    /**
     * 添加舞台灯光
     *
     * @param {Array.<THREE.light>} 灯光队列
     */
    IO.prototype.setLights = function (lights) {
        var routing = this.routing;
        for (var i = 0; i < lights.length; i++) {
            var light = importer.light(lights[i]);
            routing.light.add(light);
        }
        showLight();
        function showLight() {
            if (routing.ui == null) {
                setTimeout(showLight, 10);
                return;
            }
            routing.ui.refs.containerright.refs.verticallist.refs.lightBox.setState({
                light: routing.light.children
            });
        }
    };

    /**
     * 获取摄像机
     */
    IO.prototype.getCamera = function () {
        return exporter.camera(this.routing.stage);
    };

    /**
     * 设置摄像机
     *
     * @param {Object} conf 摄像机配置
     */
    IO.prototype.setCamera = function (conf) {
        importer.camera(this.routing, conf);
    };

    return IO;
});

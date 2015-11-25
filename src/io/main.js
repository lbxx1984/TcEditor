define(function (Require) {

    /**
     * 设置matrix4
     *
     * @param {Object3D} obj 任何具有matrix属性的3D对象
     * @param {Array.<number>} a 长度为16的数组
     */
    function setMatrix4(obj, a) {
        var m = new THREE.Matrix4();
        // 系统导出matrix的是列优先，呵呵
        m.set(
            a[0], a[4], a[8], a[12],
            a[1], a[5], a[9], a[13],
            a[2], a[6], a[10], a[14],
            a[3], a[7], a[11], a[15] 
        );
        obj.applyMatrix(m);
    }

    /**
     * 设置color值
     *
     * @param {Object3D} obj 任何具有color属性的3D对象
     * @param {number} c 整数或16进制数标识的color
     */
    function setColor(obj, c) {
        obj.color = new THREE.Color(c);
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
     * 解析灯光
     *
     * @param {Object} item 灯光JSON
     */
    IO.prototype.processLight = function (item) {
        if (typeof THREE[item.type] !== 'function') {
            return;
        }
        var light = new THREE[item.type]();
        for (var key in item) {
            switch (key) {
                case 'matrix': setMatrix4(light, item[key]);break;
                case 'color': setColor(light, item[key]);break;
                default: light[key] = item[key];break;
            }
        }
        this.routing.light.add(light);
    };

    return IO;
});

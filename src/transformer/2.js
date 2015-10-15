/**
 * 物体变换器 2D子组成
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
/**
 * 构造函数
 * @constructor
 * @param {Object} stage2D编辑器对象，对应Stage2D.js
 * @return {Object} 本变换器对外暴露的接口
 */
function Transformer2D(stage) {


    var _svg = stage.svgContent();
    var _onChange = null;
    var _onDetach = null;
    var _mode = "translate"; //translate|rotate|scale
    var _command = null;
    var _size = 0.5; //[0,2]
    var _renderSize = 50;
    var _floatSize = 50; //finalSize = _renderSize + _size * _floatSize
    var _meshID = null;
    var _help = []; //显示在svg中的控制元件


    /**内部处理函数*/
    var _producer = {
        /**
         * 创建平移工具操作徽标
         * @param {Array} center 徽标中心点坐标，对应2D物体几何中心
         */
        "translate": function(center) {
            var colors = stage.getColor(),
                x0 = center[0],
                y0 = center[1],
                hoverColor = stage.getColor("hover");
            var xh = _svg.path([
                ["M", x0, y0 + 2],
                ["L", x0 + _renderSize + _size * _floatSize - 10, y0 + 2],
                ["L", x0 + _renderSize + _size * _floatSize - 10, y0 + 6],
                ["L", x0 + _renderSize + _size * _floatSize, y0],
                ["L", x0 + _renderSize + _size * _floatSize - 10, y0 - 6],
                ["L", x0 + _renderSize + _size * _floatSize - 10, y0 - 2],
                ["L", x0, y0 - 2],
                ["M", x0, y0 + 2]
            ]).attr({
                "fill": colors[0]
            });
            var yh = _svg.path([
                ["M", x0 + 2, y0],
                ["L", x0 + 2, y0 + _renderSize + _size * _floatSize - 10],
                ["L", x0 + 6, y0 + _renderSize + _size * _floatSize - 10],
                ["L", x0, y0 + _renderSize + _size * _floatSize],
                ["L", x0 - 6, y0 + _renderSize + _size * _floatSize - 10],
                ["L", x0 - 2, y0 + _renderSize + _size * _floatSize - 10],
                ["L", x0 - 2, y0],
                ["M", x0 + 2, y0]
            ]).attr({
                "fill": colors[1]
            });
            var circle = _svg.circle(x0, y0, 5).attr({
                "fill": hoverColor
            });
            //
            _help.push(xh);
            _help.push(yh);
            _help.push(circle);
            //
            circle[0].tcType = yh[0].tcType = xh[0].tcType = "T2D";
            xh[0].tcItem = "x";
            yh[0].tcItem = "y";
            circle[0].tcItem = "b";
            xh[0].tcCursor = "eResize";
            yh[0].tcCursor = "sResize";
            circle[0].tcCursor = "move";
        },
        "rotate": function() {
            //TODO
        },
        "scale": function() {
            //TODO
        }
    };
    var _moving = {
        /**
         * 拖动平移工具徽标
         * @param {Object} dMouse2D DOM坐标系的坐标增量
         * @param {Object} dMouse3D 世界坐标系中的坐标增量
         */
        "translate": function(dMouse2d, dMouse3d) {
            var mesh = stage.getMesh(_meshID);
            if (!mesh || !_command) return;
            if (_command == "x") {
                dMouse2d[1] = 0;
            } else if (_command == "y") {
                dMouse2d[0] = 0;
            }
            mesh.translate(dMouse2d[0], dMouse2d[1]);
            _help[0].translate(dMouse2d[0], dMouse2d[1]);
            _help[1].translate(dMouse2d[0], dMouse2d[1]);
            _help[2].translate(dMouse2d[0], dMouse2d[1]);
            stage.reDraw();
        },
        "rotate": function() {
            //TODO
        },
        "scale": function() {
            //TODO
        }
    };
    var _moved = {
        /**
         * 平移工具徽标拖动完毕
         * @param {Object} dMouse2D DOM坐标系的坐标增量
         * @param {Object} dMouse3D 世界坐标系中的坐标增量
         */
        "translate": function(dMouse2d, dMouse3d) {
            var mesh = stage.getMesh(_meshID);
            if (!mesh) return;
            var dx = dMouse3d[0];
            var dy = dMouse3d[1];
            var dz = dMouse3d[2];
            var view = stage.getView();
            if (view == "xoz") {
                if (_command == "x") {
                    dz = dy = 0;
                } else if (_command == "y") {
                    dx = dy = 0;
                }
            } else if (view == "xoy") {
                if (_command == "x") {
                    dy = dz = 0;
                } else if (_command == "y") {
                    dx = dz = 0;
                }
            } else {
                if (_command == "x") {
                    dz = dx = 0;
                } else if (_command == "y") {
                    dy = dx = 0;
                }
            }
            mesh.geo.position.x = mesh.geo.position.x + dx;
            mesh.geo.position.y = mesh.geo.position.y + dy;
            mesh.geo.position.z = mesh.geo.position.z + dz;
            stage.fresh();
            update();
            if (_onChange) _onChange();
        },
        "rotate": function() {
            //TODO
        },
        "scale": function() {
            //TODO
        }
    };
    /**
     * 清空所有操作徽标
     */
    function clear() {
        for (var n = 0; n < _help.length; n++) _help[n].remove();
        _help = [];
    }
    /**
     * 解绑物体
     */
    function detach() {
        clear();
        _meshID = null;
        _command = null;
        if (_onDetach) {
            _onDetach();
        }
    }
    /**
     * 绑定物体
     * @param {number} id 物体id
     */
    function attach(id) {
        _meshID = id;
        var mesh = stage.getMesh(id);
        if (!mesh) return;
        update();
    }
    /**
     * 重新绘制操作徽标
     */
    function update() {
        if (_meshID == null) return;
        var mesh = stage.getMesh(_meshID);
        if (!mesh) return;
        clear();
        _mode = "translate";
        _producer[_mode](mesh.center);
    }


    return {
        /**
         * 重新绘制操作徽标
         */
        update: function() {
            update();
        },
        /**
         * 解绑物体
         */
        detach: function() {
            detach();
        },
        /**
         * 绑定物体
         * @param {number} id 物体id
         */
        attach: function(id) {
            attach(id);
        },
        /**
         * 鼠标正在拖动2D组件
         * @param {Object} dMouse2D DOM坐标系的坐标增量
         * @param {Object} dMouse3D 世界坐标系中的坐标增量
         */
        moving: function(dMouse2d, dMouse3d) {
            _moving[_mode](dMouse2d, dMouse3d);
        },
        /**
         * 鼠标释放2D组件的拖放
         * @param {Object} dMouse2D DOM坐标系的坐标增量
         * @param {Object} dMouse3D 世界坐标系中的坐标增量
         */
        moved: function(dMouse2d, dMouse3d) {
            _moved[_mode](dMouse2d, dMouse3d);
            _command = null;
        },
        /**
         * 设置2D组件的拖拽指令
         * @param {string} v 2D拖拽指令，横向(x)、纵向(y)、全向(other)
         */
        setCommand: function(value) {
            _command = value;
        },
        /**
         * 获取2D组件的拖拽命令
         * @return {string} 2D拖拽指令
         */
        getCommand: function() {
            return _command;
        },
        /**
         * 设置变形器的工作模式，平移、缩放、旋转
         * @param {string} value 工作模式：translate|scale|rotate
         */
        setMode: function(value) {
            _mode = value;
            update();
        },
        /**
         * 设置变形器操作徽标大小
         * @param {number} value 大于，范围[0,2]
         */
        setSize: function(value) {
            _size = value;
            update();
        },
        /**
         * 设置变形器的工作空间，世界空间、物体本地空间
         */
        setSpace: function() {
            //todo
        },
        /**
         * 获取当前操作徽标大小
         * @return {number} [0,2]
         */
        getSize: function() {
            return _size;
        },
        /**
         * 注册onDetach事件句柄，此事件在变换器物体被卸载后触发
         * @param {function} func 回调事件句柄
         */
        onDetach: function(func) {
            _onDetach = func;
        },
        /**
         * 注册onChange事件句柄，此事件在物体发生变换时触发
         * @param {function} func 回调事件句柄
         */
        onChange: function(func) {
            _onChange = func;
        }
    }
}
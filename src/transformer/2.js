

    var _moving = {
        /**
         * 拖动平移工具徽标
         * @param {Object} dMouse2D DOM坐标系的坐标增量
         * @param {Object} dMouse3D 世界坐标系中的坐标增量
         */
        "translate": function(dMouse2d, dMouse3d) {
            stage.reDraw();
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
     * 重新绘制操作徽标
     */
    function update() {
      
       
       
     
     
        _producer[_mode](mesh.center);
    }


    return {

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
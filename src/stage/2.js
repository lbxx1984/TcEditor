
    /***辅助函数***/
    /**
     * 渲染物体
     * @param {Object} ctx canvas画布
     */
    function render(ctx) {
        _meshes = [];
        for (var key in _children) {
            if (!_children[key].visible) continue;
            _meshes[key] = new Mesh2D({
                geo: _children[key],
                type: _type,
                width: _width,
                height: _height,
                offset: _offset,
                scale: _scale,
                meshColor: _meshColor
            });
        }
        drawMeshes(ctx);
    }
    /**
     * 绘制物体
     * @param {Object} ctx canvas画布
     * @param {number} mx 鼠标在画布中的位置，x坐标
     * @param {number} my 鼠标在画布中的位置，y坐标
     * @return {number} 物体id，如果当前绘制的物体在鼠标下，返回id，否则null
     */
    function drawMeshes(ctx, mx, my) {
        var meshHover = null;
        ctx.clearRect(0, 0, _width, _height);
        for(var key in _meshes){
            if (!_meshes[key].visible) {
                continue;
            }
            _meshes[key].draw(_meshCTX);
            if (mx != null && my != null && _meshCTX.isPointInPath(mx, my)) {
                _meshCTX.fillStyle = _meshHoverColor;
                meshHover = key;
            } else if (key == _meshSelected) {
                _meshCTX.fillStyle = _meshSelectColor;
            } else {
                _meshCTX.fillStyle = _meshColor;
            }
            _meshCTX.fill();
        }
        return meshHover;
    }

    /**
     * 通过事件形式输出摄像机位置
     */
    function outputCamera() {
        if (!_event["onCameraChange"]) return;
        var pos = {x: 9999, y: 9999, z: 9999};
        var lookAt = {x: 0, y: 0, z: 0};
        var r = {
            r: 100 * (1 - _scale / 5.5),
            b: 100,
            a: 0
        };
        if (_type == "xoz") {
            lookAt.x = pos.x = -_offset.x;
            lookAt.z = pos.z = -_offset.y;
        } else if (_type == "xoy") {
            lookAt.x = pos.x = -_offset.x;
            lookAt.y = pos.y = -_offset.y;
        } else if (_type == "yoz") {
            lookAt.y = pos.y = -_offset.x;
            lookAt.z = pos.z = -_offset.y;
        }
        _event["onCameraChange"](pos, lookAt, r);
    }
    /**
     * 通过事件形式输出舞台已刷新通知
     */
    function outputFreshHandle() {
        if (!_event["onFresh"]) return;
        _event["onFresh"]();
    }


    /***外部接口***/
    /**
     * 设置物体可见性
     * @param {number} id 物体id
     * @param {boolean} value 是否可见
     */
    _this.meshVisible = function(id, value) {
        if (_meshes[id]) {
            _meshes[id].visible = value;
            drawMeshes(_meshCTX);
        }
    }
    /**
     * 获取鼠标下未锁定的物体
     * @param {Object} e 鼠标事件对象
     */
    _this.selectMeshByMouse = function (e) {
        var pos = _this.offset();
        var geo = drawMeshes(
            _meshCTX, 
            e.clientX - pos.left, 
            e.clientY - pos.top + document.body.scrollTop);
        if(geo != null){
            return _meshes[geo].geo;
        } else {
            return null;
        }
    }
    /**
     * 清除选中物体
     */
    _this.meshClearSelected = function() {
        _meshSelected = null;
        drawMeshes(_meshCTX);
    }
    /**
     * 选中物体
     * @param {number} id 物体id
     */
    _this.meshSetSelected = function(id) {
        _meshSelected = id;
        drawMeshes(_meshCTX);
    }
    /**
     * 根据id获取2D物体
     * @param {number} id 物体id
     * @return {Object} 2D物体对象
     */
    _this.getMesh = function(id) {
        return _meshes[id];
    }
    /**
     * 删除物体
     * @param {number} 物体id
     */
    _this.deleteMesh = function(id) {
        if (_meshes[id]) {
            delete _meshes[id];
            drawMeshes(_meshCTX);
        }
    }
    /**
     * 获取辅助控制器绘板
     * @return {Object} svg绘图接口，Raphael
     */
    _this.svgContent = function() {
        return _helperCTX;
    }
    /**
     * 获取鼠标在编辑器中的3D坐标，增维补0
     * @return {Object} 3D坐标
     */
    _this.getMousePosition = function() {
        return _mouse.clone();
    }
    /**
     * 绑定对应的3D舞台
     * @param {Object} stage 3D场景组件对象，对应Stage3D.js
     */
    _this.bindStage = function(stage) {
        _children = stage.children();
    }
    /**
     * 切换舞台视角
     * @param {string} view 视角，可以理解为投影坐标平面xoz、zoy、xoy
     */
    _this.changeView = function(view) {
        _type = view;
        _this.fresh();
        outputCamera();
    }
    /**
     * 获取舞台当前视角
     * @return {string} 视角标示
     */
    _this.getView = function() {
        return _type;
    }
    /**
     * 获取舞台的颜色配制
     * @param {string|Array} type 颜色类型
     *      select：物体选中状态下的颜色
     *      hover：物体在鼠标下的颜色
     *      null：[当前横轴颜色、当前纵轴颜色]
     */
    _this.getColor = function(type) {
        if (type == "select") return _meshSelectColor;
        if (type == "hover") return _meshHoverColor;
        if (!type) {
            if (_type == "xoz") {
                return ["#ff0000", "#4285F4"];
            } else if (_type == "xoy") {
                return ["#ff0000", "#3E9B1C"];
            } else {
                return ["#3E9B1C", "#4285F4"];
            }
        }
    }
    /**
     * 设置舞台大小
     * @param {number} width 舞台宽度
     * @param {number} height 舞台高度
     */
    _this.resize = function(width, height) {
        _gridCanvas.width = _width = width;
        _gridCanvas.height = _height = height;
        _meshCanvas.width = _width;
        _meshCanvas.height = _height;
        _helperContainer.style.width = _width + "px";
        _helperContainer.style.height = _height + "px";
        _this.fresh();
    }
    /**
     * 重新渲染舞台，包括坐标格、物体，渲染完成后触发onFresh事件
     */
    _this.fresh = function() {
        drawGrid(_gridCTX);
        render(_meshCTX);
        outputFreshHandle();
    }
    /**
     * 只重绘舞台中的物体
     */
    _this.reDraw = function() {
        drawMeshes(_meshCTX);
    }
    /**
     * 移动摄像机观察点
     * @param {number} dx 观察点横向增量
     * @param {number} dy 观察点纵向增量
     */
    _this.lookAt = function(dx, dy) {
        _offset.x += dx * _scale;
        _offset.y += dy * _scale;
        _this.fresh();
        outputCamera();
    }
    /**
     * 缩放摄像机
     * @param {number} v 缩放值，在2D中范围时[0.5,6]
     */
    _this.zoomTo = function(v) {
        _offset.x = _offset.x / _scale;
        _offset.y = _offset.y / _scale;
        _scale = 5.5 * (1 - 0.01 * v);
        if (_scale < 0.5) _scale = 0.5;
        if (_scale > 6) _scale = 6;
        _offset.x = _offset.x * _scale;
        _offset.y = _offset.y * _scale;
        _this.fresh();
        outputCamera();
    }
    /**
     * 缩放摄像机
     * @param {boolean} a 推进或拉远
     *      此方法与上一个不同在于触发，此方法一般通过鼠标滚轮触发
     */

    /**
     * 切换坐标格的显示/隐藏状态
     */
    _this.toggleAxis = function() {
        _showGrid = !_showGrid;
        if (_showGrid) {
            drawGrid(_gridCTX);
        } else {
            _gridCTX.clearRect(0, 0, _width, _height);
        }
    }
    /**
     * 缩放坐标格单元格大小
     * @param {boolean} a true为放大，false为缩小
     */
    _this.resizeGrid = function(a) {
        if (a) {
            _cellSize = Math.min(_cellSize * 2, 400)
        } else {
            _cellSize = Math.max(_cellSize / 2, 25);
        }
        drawGrid(_gridCTX);
    }
    /**
     * 设置坐标格颜色
     * @param {string} e 颜色
     */
    _this.setGridColor = function(e) {
        _gridColor = e;
        drawGrid(_gridCTX);
    }
    /**
     * 为舞台系统绑定事件
     * @param {string} type 事件类型
     * @param {function} func 事件处理句柄
     */
    _this.addListener = function(type, func) {
        _event[type] = func;
    }
    /**
     * 解绑舞台系统事件
     * @param {string} type 事件类型
     * @param {function} func 事件处理句柄
     */
    _this.removeListener = function(type) {
        _event[type] = null;
    }
    return _this;
}
})(jQuery);
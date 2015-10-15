/**
 * 2D舞台
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
(function($) {


/**
 * 2D舞台插件
 * @param {Object} 配置参数
 * @param {number} param.width 舞台宽度
 * @param {number} param.height 舞台高度
 * @param {boolean} param.showGrid 是否显示网格
 * @param {string} param.gridColor 网格的颜色
 * @param {string} param.meshColor 物体无状态时的颜色
 * @param {string} param.meshSelectColor 物体处于选中状态的颜色
 * @param {string} param.meshHoverColor 物体处于鼠标悬浮时的颜色
 * @param {string} param.scale 舞台的缩放比例（可以理解为摄像机焦距）
 */
$.fn.Stage2D = function(param) {


    /***内部参数***/
    //本组件
    var _this = this;
    //stage3d里的children
    var _children = null;
    //存放封装好的2D物体
    var _meshes = {}; 
    //宽度
    var _width = param.width;
    //高度
    var _height = param.height;
    //见插件注释
    var _showGrid = (param.showGrid == null) ? false : true;
    var _gridColor = (param.gridColor == null) ? "#ffffff" : param.gridColor;
    var _meshColor = (param.meshColor == null) ? "#F0F0F0" : param.meshColor;
    var _meshSelectColor = (param.meshSelectColor == null) 
                            ? "#D97915" : param.meshSelectColor;
    var _meshHoverColor = (param.meshHoverColor == null) 
                            ? "yellow" : param.meshHoverColor;
    //当前渲染视角，xoz、xoy、yoz
    var _type = "xoz";
    //舞台缩放比例，可理解为摄像机焦距
    var _scale = parseInt(param.scale) || 3;
    //舞台偏移，可理解为摄像机观测点
    var _offset = {x: 0, y: 0};
    //网格间隙
    var _cellSize = 50;
    //当前鼠标3D位置
    var _mouse = new THREE.Vector3();
    //坐标格绘板
    var _gridCanvas = document.createElement("canvas");
    //物体绘板
    var _meshCanvas = document.createElement("canvas");
    //辅助控制器绘板（SVG）
    var _helperContainer = document.createElement("div");
    //绘板接口
    var _gridCTX = null;
    var _meshCTX = null;
    var _helperCTX = null;
    //被选择的物体id
    var _meshSelected = null;
    //自定义事件hash表
    var _event = {};


    /***初始化2D场景***/
    _gridCanvas.width = _width;
    _gridCanvas.height = _height;
    _meshCanvas.width = _width;
    _meshCanvas.height = _height;
    _gridCanvas.style.cssText = "position:absolute;top:0px;left:0px;";
    _meshCanvas.style.cssText = "position:absolute;top:0px;left:0px;";
    _helperContainer.style.cssText = "position:absolute;top:0px;left:0px;"
        + "width:" + _width + "px;height:" + _height + "px;" 
    _gridCTX = _gridCanvas.getContext("2d");
    _meshCTX = _meshCanvas.getContext("2d");
    _helperCTX = Raphael(_helperContainer, _width, _height);
    this[0].appendChild(_gridCanvas);
    this[0].appendChild(_meshCanvas);
    this[0].appendChild(_helperContainer);
    drawGrid(_gridCTX);


    /***内部处理事件***/
    _this.bind("mousemove", function(e) {
        var pos = _this.offset();
        var x = (e.clientX - pos.left - _width * 0.5) 
                * _scale - _offset.x;
        var y = (_height * 0.5 - e.clientY + pos.top 
                - document.body.scrollTop) * _scale - _offset.y;
        var mouse3d = new THREE.Vector3();
        if (_type == "xoz") {
            mouse3d.x = x;
            mouse3d.z = y;
        } else if (_type == "xoy") {
            mouse3d.x = x;
            mouse3d.y = y;
        } else if (_type == "yoz") {
            mouse3d.y = x;
            mouse3d.z = y;
        }
        _mouse = mouse3d.clone();
    });
    _this[0].onmousewheel = function(event) {
        _this.zoomCamara(event.wheelDelta>0)
        outputCamera();
        event.stopPropagation();
        return false;
    };


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
     * 绘制辅助网格
     * @param {Object} ctx canvas画布
     */
    function drawGrid(ctx) {
        var x0 = 0, y0 = 0, step, x, y, color1, color2;
        x0 = _offset.x / _scale + _width * 0.5;
        y0 = _height * 0.5 - _offset.y / _scale;
        step = _cellSize / _scale;
        //初始化颜色
        if (_type == "xoz") {
            color1 = "#ff0000"; color2 = "#4285F4";
        } else if (_type == "xoy") {
            color1 = "#ff0000"; color2 = "#3E9B1C";
        } else {
            color1 = "#3E9B1C"; color2 = "#4285F4";
        }
        //清空
        ctx.clearRect(0, 0, _width, _height);
        if (!_showGrid) return;
        //绘制表格
        ctx.beginPath();
        ctx.strokeStyle = _gridColor;
        ctx.lineWidth = 0.5;
        x = x0;
        while (x <= _width) {
            ctx.moveTo(x + 0.5, 0.5);
            ctx.lineTo(x + 0.5, _height + 0.5);
            x += step;
        }
        x = x0 - step;
        while (x >= 0) {
            ctx.moveTo(x + 0.5, 0.5);
            ctx.lineTo(x + 0.5, _height + 0.5);
            x -= step;
        }
        y = y0;
        while (y <= _height) {
            ctx.moveTo(0.5, y + 0.5);
            ctx.lineTo(_width + 0.5, y + 0.5);
            y += step;
        }
        y = y0 - step;
        while (y >= 0) {
            ctx.moveTo(0.5, y + 0.5);
            ctx.lineTo(_width + 0.5, y + 0.5);
            y -= step;
        }
        ctx.stroke();
        //绘制坐标轴
        ctx.beginPath();
        if (x0 > 0) {
            ctx.strokeStyle = color2;
            ctx.lineWidth = 2;
            ctx.moveTo(x0 + 0.5, 0.5);
            ctx.lineTo(x0 + 0.5, _height + 0.5);
        }
        ctx.stroke();
        ctx.beginPath();
        if (x0 > 0) {
            ctx.strokeStyle = color1;
            ctx.lineWidth = 2;
            ctx.moveTo(0.5, y0 + 0.5);
            ctx.lineTo(_width + 0.5, y0 + 0.5);
        }
        ctx.stroke();
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
    _this.zoomCamara = function(a) {
        _offset.x = _offset.x / _scale;
        _offset.y = _offset.y / _scale;
        if (a) {
            _scale = Math.max(_scale - 0.1, 0.5);
        } else {
            _scale = Math.min(_scale + 0.1, 6);
        }
        _offset.x = _offset.x * _scale;
        _offset.y = _offset.y * _scale;
        _this.fresh();
        outputCamera();
    }
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
/**
 * @file 2D舞台
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(['raphael', './Mesh2D'], function (Raphael, Mesh2D) {


    /**
     * 获取鼠标下的可见物体
     *
     * @param {Object} e 鼠标事件对象
     */
    Stage2D.prototype.getMeshByMouse = function(e) {
        var x = e.layerX - window.scrollX;
        var y = e.layerY - window.scrollY;
        var intersects = this.renderMesh(x, y);

        if (intersects.length === 0) {
            return null;
        }
        if (intersects.length === 1) {
            return intersects[0];
        }
        // 排序
        var me = this;
        intersects.sort(function (a, b) {
            var p1 = a.position;
            var p2 = b.position;
            var result = true;
            switch (me.param.eyes) {
                case 'xoy': result = p1.z < p2.z; break;
                case 'xoz': result = p1.y > p2.y; break;
                case 'zoy': result = p1.x > p2.x; break;
                default: result = p1.x > p2.x; break;
            }
            return result;
        });
        return intersects[0];
    };


    /**
     * 设置摄像机观察点，相当于平移摄像机
     *
     * @param {number} dx 横向移动增量
     * @param {number} dy 纵向移动增量
     */
    Stage2D.prototype.cameraLookAt = function (dx, dy) {
        var param = this.param;
        param.cameraLookAt.x += dx * param.scale;
        param.cameraLookAt.y += -dy * param.scale;
        this.render();
    };


    /**
     * 缩放舞台
     *
     * @param {Object} e 鼠标wheel事件 
     */ 
    Stage2D.prototype.mousewheel = function(event) {
        this.zoomCamera(event.wheelDelta > 0);
    };


    /**
     * 获取鼠标的空间位置，投射在虚拟坐标纸上的位置
     *
     * @param {number} x 鼠标在当前舞台中的x坐标, 对应layerX
     * @param {number} y 鼠标在当前舞台中的y坐标, 对应layerY
     */
    Stage2D.prototype.getMouse3D = function (x, y) {
        var param = this.param;
        x -= window.scrollX;
        y -= window.scrollY;
        x = (x - param.width * 0.5) * param.scale - param.cameraLookAt.x;
        y = (param.height * 0.5 - y) * param.scale - param.cameraLookAt.y;
        var mouse3d = new THREE.Vector3();
        switch (this.param.eyes) {
            case 'xoz':
                mouse3d.x = x;
                mouse3d.z = y;
                break;
            case 'xoy':
                mouse3d.x = x;
                mouse3d.y = y;
                break;
            case 'zoy':
                mouse3d.z = x;
                mouse3d.y = y;
                break;
            default:
                break;
        }
        return mouse3d;
    };


    /**
     * 切换坐标轴和网格的显示隐藏状态
     */
    Stage2D.prototype.toggleHelper = function () {
        var param = this.param;
        param.showGrid = !param.showGrid;
        if (param.showGrid) {
            this.renderGrid();
        }
        else {
            var ctx = this.gridRender;
            ctx.fillStyle = param.clearColor;
            ctx.fillRect(0, 0, param.width, param.height);
        }
    };


    /**
     * 改变网格大小, 2D中无效
     *
     * @param {boolean} enlarge true放大；false缩小 
     */
    Stage2D.prototype.resizeGrid = function (enlarge) {
        console.warn('resizeGrid in stage2D is never used.');
        return;
    };


    /**
     * 改变摄像机焦距
     *
     * @param {boolean | number} dx true推近；false拉远；number具体值
     */
    Stage2D.prototype.zoomCamera = function (dx) {
        var param = this.param;
        var lookAt = param.cameraLookAt;
        lookAt.x /= param.scale;
        lookAt.y /= param.scale;
        param.scale = dx ?  Math.max(param.scale - 0.1, 0.5) : Math.min(param.scale + 0.1, 6);
        lookAt.x = lookAt.x * param.scale;
        lookAt.y = lookAt.y * param.scale;
        this.render();
    };


    /**
     * 修改编辑器大小
     *
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    Stage2D.prototype.resize = function (width, height) {
        this.param.width = width;
        this.param.height = height;
        this.gridCanvas.width = width;
        this.gridCanvas.height = height;
        this.meshCanvas.width = width;
        this.meshCanvas.height = height;
        this.helperContainer.style.width = width + 'px';
        this.helperContainer.style.height = height + 'px';
        this.helperRender.setSize(width, height);
        this.render();
    };


    /**
     * 绘制坐标格
     */
    Stage2D.prototype.renderGrid = function () {
        var param = this.param;
        var width = param.width;
        var height = param.height;
        var x0 = param.cameraLookAt.x / param.scale + width * 0.5;
        var y0 = height * 0.5 - param.cameraLookAt.y / param.scale;
        var step = param.gridStep / param.scale;
        var color1 = param.colors[param.eyes][0];
        var color2 = param.colors[param.eyes][1];
        var i = 0;
        var n = 0;
        var ctx = this.gridRender;

        ctx.fillStyle = param.clearColor;
        ctx.fillRect(0, 0, width, height);
        if (!param.showGrid) return;

        i = x0; n = 0; while (i <= width) {line(i + 0.5, 0.5, i + 0.5, height + 0.5, n); i += step; n++;}
        i = x0; n = 0; while (i >= 0) {line(i + 0.5, 0.5, i + 0.5, height + 0.5, n); i -= step; n++;}
        i = y0; n = 0; while (i <= height) {line(0.5, i + 0.5, width + 0.5, i + 0.5, n); i += step; n++;}
        i = y0; n = 0; while (i >= 0) {line(0.5, i + 0.5, width + 0.5, i + 0.5, n); i -= step; n++;}
        if (x0 > 0) line(x0 + 0.5, 0.5, x0 + 0.5, height + 0.5, 4, color2);
        if (y0 > 0) line(0.5, y0 + 0.5, width + 0.5, y0 + 0.5, 4, color1);

        function line(a1, b1, a2, b2, n, c) {
            ctx.beginPath();
            ctx.lineWidth = c ? 2 : ((n % 5 === 0) ? 1 : 0.5);
            ctx.strokeStyle = c ? c : ((n % 5 === 0) ? param.gridHighLightColor : param.gridColor);
            ctx.moveTo(a1, b1);
            ctx.lineTo(a2, b2);
            ctx.stroke();
        }
    };


    /**
     * 绘制物体
     *
     * @param {?number} x 鼠标位置
     * @param {?number} y 鼠标位置
     * @param {?string} hover 处于hover状态的物体uuid集合，以;分割
     * @return {?Array.<Mesh2D>} 
     */
    Stage2D.prototype.renderMesh = function (x, y, hover) {
        if (typeof hover !== 'string') hover = '';
        var ctx = this.meshRender;
        var param = this.param;
        ctx.clearRect(0, 0, param.width, param.height);
        var result = [];
        for (var key in this.children) {
            var mesh2d = this.children[key];
            var mesh3d = mesh2d.mesh;
            if (!mesh3d.visible) {
                continue;
            }
            var uuid = mesh3d.uuid;
            var color = param.meshColor;
            if (uuid === hover) color = param.meshHoverColor;
            if (uuid === this.activeMesh) color = param.meshActiveColor; 
            if (mesh2d.render(ctx, color, x, y)) result.push(mesh3d);
        }
        return result;
    };


    /**
     * 载入物体
     */
    Stage2D.prototype.loadMesh = function () {
        this.children = {};
        var meshes = this.stage3d.children;
        for (var key in meshes) {
            if (!meshes.hasOwnProperty(key)) continue;
            var mesh = new Mesh2D({mesh: meshes[key], stage: this});
            this.children[key] = mesh;
        }
    };


    /**
     * 刷新
     */
    Stage2D.prototype.render = function () {
        this.loadMesh();
        this.renderGrid();
        this.renderMesh();
    };


    /*
     * 2D舞台插件构造函数
     * @constructor
     *
     * @param {Object} param配置参数
     * @param {Object} param.stage3d对应的3D舞台
     * @param {HtmlElement} param.container 舞台容器DOM
     * @param {number} param.width 舞台宽度
     * @param {number} param.height 舞台高度
     * @param {boolean} param.showGrid 是否显示网格
     * @param {number} param.gridSize 坐标格尺寸
     * @param {string} param.clearColor 舞台背景颜色
     * @param {string} param.gridColor 网格的颜色
     * @param {string} param.meshColor 物体无状态时的颜色
     * @param {string} param.meshActiveColor 物体处于选中状态的颜色
     * @param {string} param.meshHoverColor 物体处于鼠标悬浮时的颜色
     * @param {string} param.scale 摄像机距离
     */
    function Stage2D(param) {
        // stage3d
        this.stage3d = param.stage3d;
        // 物体hash，存放2D物体
        this.children = {};
        //自定义事件hash表
        this.events = {};
        // 控制参数
        this.param = {
            // 舞台参数
            container: param.container,
            width: param.width || 1000,
            height: param.height || 800,
            // helper参数
            clearColor: (param.clearColor == null) ? '#FFF' : param.clearColor,
            showGrid: (param.showGrid == null) ? false : true,
            gridColor: (param.gridColor == null) ? '#FFF' : param.gridColor,
            gridHighLightColor: (param.gridHighLightColor == null) ? '#858585' : param.gridHighLightColor,
            gridStep: (param.gridStep == null) ? 50 : param.gridStep, // 格子的空间宽度，不是图纸宽度
            colors: {
                xoz: ['#FF0000', '#4285F4'],
                xoy: ['#FF0000', '#3E9B1C'],
                zoy: ['#4285F4', '#3E9B1C']
            },
            // 物体参数
            meshColor: (param.meshColor == null) ? '#F0F0F0' : param.meshColor,
            meshActiveColor: (param.meshActiveColor == null) ? '#D97915' : param.meshActiveColor,
            meshHoverColor: (param.mesnHoverColor == null) ? 'yellow' : param.meshHoverColor,
            // 摄像机参数
            eyes: 'xoz', // 观察视角: xoz、xoy、zoy
            // 缩放比例，每一个屏幕像素代表多少个空间像素，相当于比例尺1:scale
            scale: parseInt(param.scale, 10) || 2, 
            cameraLookAt: {x: 0, y: 0}
        };
        // 坐标格绘板
        this.gridCanvas = document.createElement('canvas');
        // 物体绘板
        this.meshCanvas = document.createElement('canvas');
        // 辅助控制器绘板（SVG）
        this.helperContainer = document.createElement('div');
        // 绘板接口
        this.gridRender = this.gridCanvas.getContext('2d');
        this.meshRender = this.meshCanvas.getContext('2d');
        this.helperRender = Raphael(this.helperContainer, this.param.width, this.param.height);
        this.param.container.appendChild(this.gridCanvas);
        this.param.container.appendChild(this.meshCanvas);
        this.param.container.appendChild(this.helperContainer);
        // 绘制
        this.resize(this.param.width, this.param.height);
    }


    return Stage2D;
});
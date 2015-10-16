/**
 * @file 2D舞台
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(['raphael'], function (Raphael) {


    /**
     * 获取鼠标下的可见物体
     *
     * @param {Object} e 鼠标事件对象
     * @param {?Array.<Object>} arr 物体数组，如果指定就从数组中查找，不指定从全局查找
     * @return {Object} 3D物体对象 或null
     */
    Stage2D.prototype.getMeshByMouse = function(e, arr) {
        console.log('getMeshByMouse');
    };


    /**
     * 设置摄像机观察点，相当于平移摄像机
     *
     * @param {number} dx 横向移动增量
     * @param {number} dy 纵向移动增量
     */
    Stage2D.prototype.cameraLookAt = function (dx, dy) {
        console.log('cameraLookAt');
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
            case 'yoz':
                mouse3d.y = x;
                mouse3d.z = y;
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
        this.renderGrid();
    };


    /**
     * 设置摄像机位置
     *
     * @param {Object} p 摄像机位置配置
     * @param {number} p.a 对应cameraAngleA
     * @param {number} p.b 对应cameraAngleB
     */
    Stage2D.prototype.setCamera = function (p) {
        console.log('setCamera');
    };


    /**
     * 修改编辑器大小
     *
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    Stage2D.prototype.resize = function (width, height) {
        console.log('resize');
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
     * 设置摄像机位置
     */
    Stage2D.prototype.updateCameraPosition = function () {
        console.log('updateCameraPosition');
    };


    /**
     * 刷新
     */
    Stage2D.prototype.render = function () {
        this.renderGrid();
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
        /**初始化参数**/
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
                yoz: ['#3E9B1C', '#4285F4']
            },
            // 物体参数
            meshColor: (param.meshColor == null) ? '#F0F0F0' : param.meshColor,
            meshActiveColor: (param.meshActiveColor == null) ? '#D97915' : param.meshActiveColor,
            meshHoverColor: (param.mesnHoverColor == null) ? 'yellow' : param.meshHoverColor,
            // 摄像机参数
            eyes: 'xoz', // 观察视角: xoz、xoy、yoz
            // 缩放比例，每一个屏幕像素代表多少个空间像素，相当于比例尺1:scale
            scale: parseInt(param.scale, 10) || 1, 
            cameraLookAt: {x: 0, y: 0}
        };
        //坐标格绘板
        this.gridCanvas = document.createElement('canvas');
        //物体绘板
        this.meshCanvas = document.createElement('canvas');
        //辅助控制器绘板（SVG）
        this.helperContainer = document.createElement('div');
        //绘板接口
        this.gridRender = null;
        this.meshRender = null;
        this.helperRender = null;
        
         /***初始化2D场景***/
        this.gridCanvas.width = this.param.width;
        this.gridCanvas.height = this.param.height;
        this.meshCanvas.width = this.param.width;
        this.meshCanvas.height = this.param.height;
        this.helperContainer.style.width = this.param.width + 'px';
        this.helperContainer.style.height = this.param.height + 'px';

        this.gridRender = this.gridCanvas.getContext('2d');
        this.meshRender = this.meshCanvas.getContext('2d');
        this.helperRender = Raphael(this.helperContainer, this.param.width, this.param.height);
        this.param.container.appendChild(this.gridCanvas);
        this.param.container.appendChild(this.meshCanvas);
        this.param.container.appendChild(this.helperContainer);
        
        this.render();
    }


    return Stage2D;
});
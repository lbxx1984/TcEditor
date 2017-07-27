/**
 * 2D舞台的坐标网格
 */
define(function (require) {


    var _ = require('underscore');
    var math = require('../core/math');
    var handlerFactory = require('./common/handlerFactories');


    // 绘制方法
    function draw(ctx, x0, y0, x1, y1, width, color) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }


    /**
     * 构造函数
     *
     * @param {array.<string>} param.axis 到3D空间的映射方法。['x', 'z']表示2D空间的x轴映射到3D空间的x轴，y轴映射到z轴
     * @param {number} param.cameraRadius 3D摄像机到观察点的距离
     * @param {number} param.cameraAngleA 3D摄像机视线与XOZ平面夹角
     * @param {number} param.cameraAngleB 3D摄像机视线在XOZ平面投影与X轴夹角
     * @param {object} param.cameraLookAt 3D摄像机的观察点
     * @param {HtmlElement} param.canvas 绘制网格的canvas
     * @param {HtmlElement} param.container canvas外层有尺寸的容器，用来确定canvas的尺寸
     */
    function Grid2D(param) {
        _.extend(this, param);
    }


    Grid2D.prototype.render = function () {
        var AXIS_COLOR = {
            x: '#FF1600',
            y: '#10FF00',
            z: '#0013FF'
        };
        // 准备绘制数据
        var color = this.lineColor;
        var width = this.container.offsetWidth;
        var height = this.container.offsetHeight;
        var ctx = this.canvas.getContext('2d');
        var screen2axis = handlerFactory.math('screen2axis', this);
        var axis2screen = handlerFactory.math('axis2screen', this);
        // 准备临时数据
        var a, b, c, d, x0, x1, y0, y1, xArr, yArr;
        a = screen2axis(0, 0);
        b = screen2axis(width, 0);
        c = screen2axis(width, height);
        d = screen2axis(0, height);
        x0 = Math.min(a[0], b[0], c[0], d[0]);
        x1 = Math.max(a[0], b[0], c[0], d[0]);
        y0 = Math.min(a[1], b[1], c[1], d[1]);
        y1 = Math.max(a[1], b[1], c[1], d[1]);
        x0 = 50 * (parseInt(x0 / 50, 10) + (x0 > 0 ? 2 : -2));
        x1 = 50 * (parseInt(x1 / 50, 10) + (x1 > 0 ? 2 : -2));
        y0 = 50 * (parseInt(y0 / 50, 10) + (y0 > 0 ? 2 : -2));
        y1 = 50 * (parseInt(y1 / 50, 10) + (y1 > 0 ? 2 : -2));
        xArr = [x0];
        yArr = [y0];
        while (x0 + 50 <= x1) xArr.push(x0 = x0 + 50);
        while (y0 + 50 <= y1) yArr.push(y0 = y0 + 50);
        // 设置画布
        this.canvas.width = width;
        this.canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        // 绘制所有y轴
        xArr.map(function (x) {
            a = axis2screen(x, yArr[0]);
            b = axis2screen(x, yArr[yArr.length - 1]);
            draw(ctx, a[0], a[1], b[0], b[1], 1, color);
        });
        // 绘制所有x轴
        yArr.map(function (y) {
            a = axis2screen(xArr[0], y);
            b = axis2screen(xArr[xArr.length - 1], y);
            draw(ctx, a[0], a[1], b[0], b[1], 1, color);
        });
        // 绘制坐标轴
        a = axis2screen(0, 0);
        b = axis2screen(200, 0);
        c = axis2screen(0, 200);
        draw(ctx, a[0], a[1], b[0], b[1], 2, AXIS_COLOR[this.axis[0]]);
        draw(ctx, a[0], a[1], c[0], c[1], 2, AXIS_COLOR[this.axis[1]]);
    };


    Grid2D.prototype.getMouse3D = function (x, y) {
        return handlerFactory.math('screen2axis', this)(x, y);
    };


    return Grid2D;


});
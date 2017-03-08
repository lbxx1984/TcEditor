/**
 * 2D变换工具
 */
define(function (require) {


    var _ = require('underscore');
    var raphael = require('raphael');
    var math = require('../core/math');
    var AXIS_COLOR = {
        x: '#FF1600',
        y: '#10FF00',
        z: '#0013FF'
    };
    var renderer = {
        translate: {
            world: function (me) {
                var axis = me.axis;
                var axis2screen = mathFactory('axis2screen', me);
                var local2world = local2worldFactory(me);
                var o = local2world(0, 0, 0);
                var a = {x: o.x, y: o.y, z: o.z};
                var b = {x: o.x, y: o.y, z: o.z};
                a[axis[0]] += 100;
                b[axis[1]] += 100;
                o = axis2screen(o[axis[0]], o[axis[1]]);
                a = axis2screen(a[axis[0]], a[axis[1]]);
                b = axis2screen(b[axis[0]], b[axis[1]]);
                var d1 = Math.sqrt((o[0] - a[0]) * (o[0] - a[0]) + (o[1] - a[1]) * (o[1] - a[1]));
                var d2 = Math.sqrt((o[0] - b[0]) * (o[0] - b[0]) + (o[1] - b[1]) * (o[1] - b[1]));
                me.helpInfo = {
                    o: o,
                    a: a,
                    b: b,
                    sina: (a[0] - o[0]) / d1,
                    cosa: (a[1] - o[1]) / d1,
                    sinb: (b[0] - o[0]) / d2,
                    cosb: (b[1] - o[1]) / d2,
                    axis2screen: axis2screen,
                    local2world: local2world,
                    screen2axis: mathFactory('screen2axis', me)
                };
                // 平面
                me.helpers[me.helpers.length] = drawFace(me.helpInfo, me.svg, me.size).attr({
                    stroke: 'rgba(255, 255, 255, 0.5)',
                    fill: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer'
                }).mousedown(function() {
                    me.command = 'o';
                });
                // 轴1
                me.helpers[me.helpers.length] = drawArrow('a', me.helpInfo, me.svg, me.size).attr({
                    fill: AXIS_COLOR[axis[0]],
                    cursor: 'pointer'
                }).mousedown(function () {
                    me.command = axis[0];
                });
                // 轴2
                me.helpers[me.helpers.length] = drawArrow('b', me.helpInfo, me.svg, me.size).attr({
                    fill: AXIS_COLOR[axis[1]],
                    cursor: 'pointer'
                }).mousedown(function () {
                    me.command = axis[1];
                });
            }
        }
    };
    var processer = {
        translate: {
            world: function (dx, dy, me) {
                var mesh = me.mesh;
                var info = me.helpInfo;
                var d1 = (info.cosb * dx - info.sinb * dy) / (info.sina * info.cosb - info.sinb * info.cosa);
                var d2 = (info.cosa * dx - info.sina * dy) / (info.cosa * info.sinb - info.cosb * info.sina);
                d1 = me.command === me.axis[1] ? 0 : d1;
                d2 = me.command === me.axis[0] ? 0 : d2;
                dx = d1 * info.sina + d2 * info.sinb;
                dy = d1 * info.cosa + d2 * info.cosb;
                var center = info.screen2axis(info.o[0], info.o[1]);
                var to = info.screen2axis(info.o[0] + dx, info.o[1] + dy);
                var d3 = {x: 0, y: 0, z: 0};
                d3[me.axis[0]] = to[0] - center[0];
                d3[me.axis[1]] = to[1] - center[1];
                mesh.position.set(mesh.position.x + d3.x, mesh.position.y + d3.y, mesh.position.z + d3.z);
                typeof me.onChange === 'function' && me.onChange();
            }
        }
    };


    function mathFactory(handler, me) {
        var width = me.container.offsetWidth;
        var height = me.container.offsetHeight;
        var axis = me.axis;
        var stageInfo = {
            v: axis.join('o'),
            a: me.cameraAngleA,
            b: (me.cameraAngleB % 360 + 360) % 360
        };
        var trans = [
            me.cameraLookAt[axis[0]],
            me.cameraLookAt[axis[1]]
        ];
        var rotate = stageInfo.v === 'xoz' ? (stageInfo.b - 90) : 0;
        var scale = me.cameraRadius / 1000;
        return function (x, y) {
            return math[handler](x, y, width, height, trans, scale, rotate, stageInfo);
        };
    }

    function local2worldFactory(me) {
        return function (x, y, z) {
            var matrix = math.getRotateMatrix(me.mesh);
            var arr = math.local2world(x, y, z, matrix, me.mesh);
            return {
                x: arr[0],
                y: arr[1],
                z: arr[2]
            };
        };
    }

    function drawArrow(axis, info, svg, size) {
        var x0 = info.o[0];
        var y0 = info.o[1];
        var x1 = info[axis][0];
        var y1 = info[axis][1];
        var sin = info['sin' + axis];
        var cos = info['cos' + axis];
        var r = 2;
        d = 100 * size;
        x1 = d * sin + x0;
        y1 = d * cos + y0;
        return svg.path([
            ['M', x0 + r * cos, y0 - r * sin],
            ['L', x1 + r * cos, y1 - r * sin],
            ['L', x1 + 3 * r * cos, y1 - 3 * r * sin],
            ['L', (3 * r + d) * sin + x0, (3 * r + d) * cos + y0],
            ['L', x1 - 3 * r * cos, y1 + 3 * r * sin],
            ['L', x1 - r * cos, y1 + r * sin],
            ['L', x0 - r * cos, y0 + r * sin],
            ['L', x0 + r * cos, y0 - r * sin],
            ['M', x0 + r * cos, y0 - r * sin]
        ]);
    }

    function drawFace(info, svg, size) {
        var x0 = info.o[0];
        var y0 = info.o[1];
        var x1 = info.a[0];
        var y1 = info.a[1];
        var x2 = info.b[0];
        var y2 = info.b[1];
        var x3 = 0;
        var y3 = 0;
        var sina = info.sina;
        var cosa = info.cosa;
        var sinb = info.sinb;
        var cosb = info.cosb;
        d1 = 50 * size;
        d2 = 50 * size;
        x1 = d1 * sina + x0;
        y1 = d1 * cosa + y0;
        x2 = d2 * sinb + x0;
        y2 = d2 * cosb + y0;
        x3 = d1 * sina + d2 * sinb + x0;
        y3 = d1 * cosa + d2 * cosb + y0;
        return svg.path([
            ['M', x0, y0],
            ['L', x1, y1],
            ['L', x3, y3],
            ['L', x2, y2],
            ['M', x0, y0]
        ]);
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
    function Transformer2D(param) {
        _.extend(this, param);
        this.mesh = null;
        this.helpers = [];
        this.svg = raphael(param.canvas, this.container.offsetWidth, this.container.offsetHeight);
        this.___containerMouseDownHandler___ = this.___containerMouseDownHandler___.bind(this);
        this.___containerMouseUpHandler___ = this.___containerMouseUpHandler___.bind(this);
        this.___containerMouseMoveHandler___ = this.___containerMouseMoveHandler___.bind(this);
        this.container.addEventListener('mousedown', this.___containerMouseDownHandler___);
    }


    Transformer2D.prototype.updateSize = function () {
        this.svg.setSize(this.container.offsetWidth, this.container.offsetHeight);
    };


    Transformer2D.prototype.attach = function (mesh) {
        while (this.helpers.length) this.helpers.pop().remove();
        this.mesh = mesh;
        if (!mesh) return;
        if (!renderer[this.mode] || !renderer[this.mode][this.space]) return;
        renderer[this.mode][this.space](this);
    };


    Transformer2D.prototype.detach = function () {
        while (this.helpers.length) this.helpers.pop().remove();
        this.mesh = null;
    };


    Transformer2D.prototype.___containerMouseDownHandler___ = function (evt) {
        if (!this.mesh || !this.command) return;
        this.container.addEventListener('mouseup', this.___containerMouseUpHandler___);
        this.container.addEventListener('mousemove', this.___containerMouseMoveHandler___);
        this.mouseX = evt.clientX;
        this.mouseY = evt.clientY;
    };


    Transformer2D.prototype.___containerMouseMoveHandler___ = function (evt) {
        if (!this.mesh || !this.command || !processer[this.mode] || !processer[this.mode][this.space]) return;
        var dx = evt.clientX - this.mouseX;
        var dy = evt.clientY - this.mouseY;
        this.mouseX = evt.clientX;
        this.mouseY = evt.clientY;
        processer[this.mode][this.space](dx, dy, this);
    };


    Transformer2D.prototype.___containerMouseUpHandler___ = function (evt) {
        this.command = '';
        this.container.removeEventListener('mouseup', this.___containerMouseUpHandler___);
        this.container.removeEventListener('mousemove', this.___containerMouseMoveHandler___);
    };


    return Transformer2D;


});
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
                var axis2screen = axis2screenFactory('axis2screen', me);
                var local2world = local2worldFactory(me);
                var center = local2world(0, 0, 0);
                var target0 = {x: center.x, y: center.y, z: center.z};
                var target1 = {x: center.x, y: center.y, z: center.z};
                target0[axis[0]] += 100;
                target1[axis[1]] += 100;
                center = axis2screen(center[axis[0]], center[axis[1]]);
                target0 = axis2screen(target0[axis[0]], target0[axis[1]]);
                target1 = axis2screen(target1[axis[0]], target1[axis[1]]);
                me.helpers[me.helpers.length] = drawArrow(center, target0, me.svg, me.size).attr({
                    fill: AXIS_COLOR[axis[0]],
                    cursor: 'pointer'
                });
                me.helpers[me.helpers.length] = drawArrow(center, target1, me.svg, me.size).attr({
                    fill: AXIS_COLOR[axis[1]],
                    cursor: 'pointer'
                });
            }
        }
    };


    function axis2screenFactory(handler, me) {
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


    function drawArrow(o1, o2, svg, size) {
        var x0 = o1[0];
        var y0 = o1[1];
        var x1 = o2[0];
        var y1 = o2[1];
        var d = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
        var r = 2;
        var sina = (x1 - x0) / d;
        var cosa = (y1 - y0) / d;
        d = 100 * size;
        x1 = d * sina + x0;
        y1 = d * cosa + y0;
        return svg.path([
            ['M', x0 + r * cosa, y0 - r * sina],
            ['L', x1 + r * cosa, y1 - r * sina],
            ['L', x1 + 3 * r * cosa, y1 - 3 * r * sina],
            ['L', (3 * r + d) * sina + x0, (3 * r + d) * cosa + y0],
            ['L', x1 - 3 * r * cosa, y1 + 3 * r * sina],
            ['L', x1 - r * cosa, y1 + r * sina],
            ['L', x0 - r * cosa, y0 + r * sina],
            ['L', x0 + r * cosa, y0 - r * sina],
            ['M', x0 + r * cosa, y0 - r * sina]
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

    return Transformer2D;


});
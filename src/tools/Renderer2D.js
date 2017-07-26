/**
 * 2D舞台渲染器
 */
define(function (require) {


    var _ = require('underscore');
    var math = require('../core/math');
    var Mesh2D = require('./Mesh2D');


    function line(x0, y0, x1, y1, ctx) {
        var d = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
        var r = 1;
        var sina = (x1 - x0) / d;
        var cosa = (y1 - y0) / d;
        ctx.moveTo(x0 + r * cosa, y0 - r * sina);
        ctx.lineTo(x1 + r * cosa, y1 - r * sina);
        ctx.lineTo(x1 - r * cosa, y1 + r * sina);
        ctx.lineTo(x0 - r * cosa, y0 + r * sina);
        ctx.lineTo(x0 + r * cosa, y0 - r * sina);
    }


    function setupMeshes(mesh3d, mesh2d) {
        mesh2d = mesh2d || {};
        // 创建2D物体
        _.each(mesh3d, function (item, key) {
            if (!mesh2d[key]) mesh2d[key] = new Mesh2D({mesh3d: item});
        });
        // 删除无用物体
        _.each(mesh2d, function (item, key) {
            if (!mesh3d[key]) delete mesh2d[key];
        });
        return mesh2d;
    }


    function mathFactory(handler, width, height, trans, scale, rotate, stageInfo) {
        return function (x, y) {
            return math[handler](x, y, width, height, trans, scale, rotate, stageInfo);
        };
    }


    /**
     * 构造函数
     *
     * @param {array.<string>} param.axis 到3D空间的映射方法。['x', 'z']表示2D空间的x轴映射到3D空间的x轴，y轴映射到z轴
     * @param {number} param.cameraRadius 3D摄像机到观察点的距离
     * @param {number} param.cameraAngleA 3D摄像机视线与XOZ平面夹角
     * @param {number} param.cameraAngleB 3D摄像机视线在XOZ平面投影与X轴夹角
     * @param {object} param.cameraLookAt 3D摄像机的观察点
     * @param {object} param.mesh3d 3D物体的hash
     * @param {HtmlElement} param.canvas 绘制网格的canvas
     * @param {HtmlElement} param.container canvas外层有尺寸的容器，用来确定canvas的尺寸
     */
    function Renderer2D(param) {
        _.extend(this, param);
    }


    Renderer2D.prototype.render = function (mouseX, mouseY) {
        // 初始化画板
        var hoverMesh3D = null;
        var width = this.container.offsetWidth;
        var height = this.container.offsetHeight;
        var axis = this.axis;
        var stageInfo = {
            v: axis.join('o'),
            a: this.cameraAngleA,
            b: (this.cameraAngleB % 360 + 360) % 360
        };
        var trans = [
            this.cameraLookAt[axis[0]],
            this.cameraLookAt[axis[1]]
        ];
        var rotate = stageInfo.v === 'xoz' ? (stageInfo.b - 90) : 0;
        var scale = this.cameraRadius / 1000;
        var axis2screen = mathFactory('axis2screen', width, height, trans, scale, rotate, stageInfo);
        var ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        if (_.keys(this.mesh3d).length === 0) return;
        // 装载物体
        this.mesh2d = setupMeshes(this.mesh3d, this.mesh2d);
        // 绘制物体
        _.each(this.mesh2d, function (item, key) {
            var mesh = item.mesh3d;
            if (!mesh.visible) return;
            var vertices = item.vertices;
            var color = mesh.material.color.getHex().toString(16);
            while (color.length < 6) color = '0' + color;
            ctx.beginPath();
            ctx.lineStyle = 2;
            ctx.fillStyle = '#' + color;
            mesh.geometry.faces.map(function (face) {
                var x = axis[0];
                var y = axis[1];
                var a = axis2screen(vertices[face.a][x], vertices[face.a][y]);
                var b = axis2screen(vertices[face.b][x], vertices[face.b][y]);
                var c = axis2screen(vertices[face.c][x], vertices[face.c][y]);
                line(a[0], a[1], b[0], b[1], ctx);
                line(b[0], b[1], c[0], c[1], ctx);
                line(c[0], c[1], a[0], a[1], ctx); 
            });
            hoverMesh3D = !isNaN(mouseX) && !isNaN(mouseY) && ctx.isPointInPath(mouseX, mouseY)
                ? mesh : hoverMesh3D;
            ctx.fill();    
        });
        return hoverMesh3D;
    };


    Renderer2D.prototype.getObject2dByMouse2D = function (x, y) {
        x = x - this.container.offsetLeft;
        y = y - this.container.offsetTop;
        return this.render(x, y);
    };


    return Renderer2D;


});
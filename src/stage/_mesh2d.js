/**
 * 2D物体
 * 用于2D平面编辑器
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
 /**
  * 构造函数
  * @constructor
  * @param {Object} 配置信息
  * @param {Object} param.geo 对应的3D物体
  * @param {string} param.type 2D编辑器的显示方式
  * @param {number} param.width 2D编辑器的宽度
  * @param {number} param.height 2D编辑器的高度
  * @param {Object} param.offset 2D编辑器逻辑中心相对DOM中心的偏移
  * @param {number} param.scale 2D编辑器的缩放比例
  * @param {string} param.meshColor 物体的渲染颜色
  */
function Mesh2D(param) {
    /**本物体对应的3D物体*/
    this.geo = param.geo;
    /**本物体是否可见*/
    this.visible = true;
    /**本物体是否被锁定*/
    this.locked = false;
    /**本物体的显示视角，2D编辑器的显示方式对应*/
    this.displayType = param.type;
    /**本物体所在2D编辑器宽度*/
    this.width = param.width;
    /**本物体所在2D编辑器高度*/
    this.height = param.height;
    /**本物体所在2D编辑器逻辑中心相对DOM中心的偏移*/
    this.offset = param.offset;
    /**本物体所在2D编辑器的缩放比例*/
    this.scale = param.scale;
    /**本物体的渲染颜色*/
    this.meshColor = param.meshColor;
    /**本物体几何中心的绘制坐标*/
    this.center = [0, 0];
    /**本物体所有顶点的2D坐标*/
    this.points = [];
    /**本物体所有三角面的信息*/
    this.faces = [];

    this.createPoints();
    this.createFaces();
}
/**
 * 对物体做平移
 * @param {number} dx x轴方向变动
 * @param {number} dy y轴方向变动
 */
Mesh2D.prototype.translate = function (dx, dy) {
    for (var n = 0; n < this.points.length; n++) {
        this.points[n][0] += dx;
        this.points[n][1] += dy;
    }
}
/**
 * 重绘物体
 */
Mesh2D.prototype.reset = function() {
    this.points = [];
    this.faces = [];
    this.center = [0, 0];
    this.createPoints();
    this.createFaces();
}
/**
 * 绘制物体
 * @oaram {Object} ctx canvas的绘制器
 */
Mesh2D.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    var faces = this.faces;
    var points = this.points;
    for (var n = 0; n < faces.length; n++) {
        this.drawline(
            points[faces[n][0]][0], points[faces[n][0]][1],
            points[faces[n][1]][0], points[faces[n][1]][1],
            ctx
        );
        this.drawline(
            points[faces[n][1]][0], points[faces[n][1]][1],
            points[faces[n][2]][0], points[faces[n][2]][1],
            ctx
        );
        this.drawline(
            points[faces[n][2]][0], points[faces[n][2]][1],
            points[faces[n][0]][0], points[faces[n][0]][1],
            ctx
        );
    }
}
/**
 * 在画布上绘制一条线
 * @param {number} x0 起点的x坐标
 * @param {number} y0 起点的y坐标
 * @param {number} x1 终点的x坐标
 * @param {number} y1 终点的y坐标
 * @param {Object} ctx canvas的绘制器
 * 使用这个方法代替lineTo()的意图详见：
 *     http://blog.csdn.net/lbxx1984/article/details/40988337
 */
Mesh2D.prototype.drawline = function(x0, y0, x1, y1, ctx) {
    var d = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
    var r = 1;
    var sina = (x1 - x0) / d;
    var cosa = (y1 - y0) / d;
    ctx.moveTo(x0 + r * cosa, y0 - r * sina);
    ctx.lineTo(x0 + r * cosa + x1 - x0, y0 - r * sina + y1 - y0);
    ctx.lineTo(x0 - r * cosa + x1 - x0, y0 + r * sina + y1 - y0);
    ctx.lineTo(x0 - r * cosa, y0 + r * sina);
    ctx.lineTo(x0 + r * cosa, y0 - r * sina);
}
/**
 * 将3D物体内部的faces信息转换成本物体使用的faces数组，以便高效绘制
 */
Mesh2D.prototype.createFaces = function() {
    var points = this.points;
    var faces = this.geo.geometry.faces;
    for (var n = 0; n < faces.length; n++) {
        this.faces.push([faces[n].a, faces[n].b, faces[n].c]);
    }
}
/**
 * 将3D物体中每个顶点的3D坐标转换成本物体的2D投影坐标
 */
Mesh2D.prototype.createPoints = function() {
    var matrix = tcMath.rotateMatrix(this.geo);
    this.center = this.RectangularToDisplay(tcMath.Local2Global(0, 0, 0, matrix, this.geo));
    for (var n = 0; n < this.geo.geometry.vertices.length; n++) {
        this.points.push(
            this.RectangularToDisplay(
                tcMath.Local2Global(
                    this.geo.geometry.vertices[n].x,
                    this.geo.geometry.vertices[n].y,
                    this.geo.geometry.vertices[n].z,
                    matrix,
                    this.geo
                )
            )
        );
    }
}
/**
 * 将3D空间中的世界坐标转换成绘制坐标
 * @param {Array} pos 直角坐标系内坐标
 *    此方法根据2D编辑器的显示方式进行3D到2D的映射，再根据舞台的偏移、缩放等信息
 * 进行换算。
 */
Mesh2D.prototype.RectangularToDisplay = function(pos) {
    var x = 0,
        y = 0;
    if (this.displayType == "xoz") {
        x = pos[0];
        y = pos[2];
    } else if (this.displayType == "xoy") {
        x = pos[0];
        y = pos[1];
    } else if (this.displayType == "yoz") {
        x = pos[1];
        y = pos[2];
    }
    x = this.width * 0.5 + (x + this.offset.x) / this.scale;
    y = this.height * 0.5 - (y + this.offset.y) / this.scale;
    return [x, y];
}
/**
 * 将2D编辑器内的绘制坐标增维到3D空间中的世界坐标
 * @param {number} dx x轴方向增量
 * @oaram {number} dy y轴方向增量
 *    本方法增维时，缺少的维度补0.
 */
Mesh2D.prototype.DisplayToRectangular = function(dx, dy) {
    dy = -dy;
    dy = dy * this.scale - this.offset.y;
    dx = dx * this.scale - this.offset.x;
    if (this.displayType == "xoz") {
        return [dx, 0, dy];
    } else if (this.displayType == "xoy") {
        return [dx, dy, 0];
    } else if (this.displayType == "yoz") {
        return [0, dx, dy];
    }
}
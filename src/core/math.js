/**
 * @file 数学运算系统，由于THREE.JS有些函数有问题，这里自行实现。
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(function (require) {


    var tcMath = {};


    /**
     * 将向量p相对向量a旋转角度theta
     * WebGL使用右手坐标系, 传入的theta要取反，然后计算方向余弦和角度正弦余弦
     *
     * @param {Object} p 待旋转向量
     * @param {Object} a 旋转轴向量
     * @param {number} theta 旋转角度
     */
    function rotateVector(p, a, theta) {
        theta = -theta;
        var d = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
        var nx = -a.x / d;
        var ny = -a.y / d;
        var nz = -a.z / d;
        var cos = Math.cos(theta);
        var sin = Math.sin(theta);
        var fcos = 1 - cos;
        //坐标变化
        var x = p.x * (nx * nx * fcos + cos)
            + p.y * (nx * ny * fcos - nz * sin)
            + p.z * (nx * nz * fcos + ny * sin);
        var y = p.x * (nx * ny * fcos + nz * sin)
            + p.y * (ny * ny * fcos + cos)
            + p.z * (ny * nz * fcos - nx * sin);
        var z = p.x * (nx * nz * fcos - ny * sin)
            + p.y * (ny * nz * fcos + nx * sin)
            + p.z * (nz * nz * fcos + cos);
        return {x: x, y: y, z: z}
    }


    /**
     * 旋转映射
     *
     * @param {number} x 坐标x值
     * @param {number} y 坐标y值
     * @param {number} z 坐标z值
     * @param {Array} matrix 三向旋转矩阵
     * @return {Array} 旋转变换后的坐标
     */
    function rotate(x, y, z, matrix) {
        var rx = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
        var ry = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
        var rz = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
        return [rx, ry, rz];
    }


    /**
     * 平移映射
     *
     * @param {number} x 坐标x值
     * @param {number} y 坐标y值
     * @param {number} z 坐标z值
     * @param {Object} position 三轴偏移向量
     * @return {Array} 平移变换后的坐标
     */
    function translate(x, y, z, position) {
        return [x + position.x, y + position.y, z + position.z];
    }


    /**
     * 缩放映射
     *
     * @param {number} x 坐标x值
     * @param {number} y 坐标y值
     * @param {number} z 坐标z值
     * @param {Object} scale 三轴缩放向量
     * @return {Array} 旋转变换后的坐标
     */
    function scale(x, y, z, scale) {
        return [x * scale.x, y * scale.y, z * scale.z];
    }


    /**
     * 将世界坐标转换成某一物体的内部坐标
     *
     * @param {number} p 世界坐标系中x轴坐标值
     * @param {number} q 世界坐标系中y轴坐标值
     * @param {number} r 世界坐标系中z轴坐标值
     * @param {object} mesh 3D物体对象
     * @return {Array} [p, q, r]对应的在mesh内部的坐标
     */
    tcMath.world2local = function(p, q, r, mesh) {
        var d1 = p - mesh.position.x;
        var d2 = q - mesh.position.y;
        var d3 = r - mesh.position.z;
        var matrix = this.getRotateMatrix(mesh);
        var a1 = matrix[0][0], b1 = matrix[0][1], c1 = matrix[0][2];
        var a2 = matrix[1][0], b2 = matrix[1][1], c2 = matrix[1][2];
        var a3 = matrix[2][0], b3 = matrix[2][1], c3 = matrix[2][2];
        var d = a1 * b2 * c3 + b1 * c2 * a3 + c1 * a2 * b3 - c1 * b2 * a3 - b1 * a2 * c3 - a1 * c2 * b3;
        var e = d1 * b2 * c3 + b1 * c2 * d3 + c1 * d2 * b3 - c1 * b2 * d3 - b1 * d2 * c3 - d1 * c2 * b3;
        var f = a1 * d2 * c3 + d1 * c2 * a3 + c1 * a2 * d3 - c1 * d2 * a3 - d1 * a2 * c3 - a1 * c2 * d3;
        var g = a1 * b2 * d3 + b1 * d2 * a3 + d1 * a2 * b3 - d1 * b2 * a3 - b1 * a2 * d3 - a1 * d2 * b3;
        var x = e / d;
        var y = f / d;
        var z = g / d;
        x = x / mesh.scale.x;
        y = y / mesh.scale.y;
        z = z / mesh.scale.z;
        return [x, y, z];
    };



    /**
     * 将物体内部坐标转换成世界坐标
     *
     * @param {number} x 物体内部坐标x值
     * @param {number} y 物体内部坐标y值
     * @param {number} z 物体内部坐标z值
     * @param {Array} m 物体的旋转矩阵
     * @param {Object} o 3D物体对象
     * @return {Array} 物体内部坐标对应的世界坐标
     */
    tcMath.local2world = function(x, y, z, m, o) {
        var pos = scale(x, y, z, o.scale);
        pos = rotate(pos[0], pos[1], pos[2], m);
        pos = translate(pos[0], pos[1], pos[2], o.position);
        return pos;
    };


    /**
     * 计算物体三向旋转矩阵
     *
     * @param {obj} 3D物体对象
     * @return {Array} 三向旋转矩阵
     * 具体原理见薛文风的1995年的《三维空间坐标的旋转算法》
     */
    tcMath.getRotateMatrix = function(obj) {
        var x = {x: 1, y: 0, z: 0};
        var y = {x: 0, y: 1, z: 0};
        var z = {x: 0, y: 0, z: 1};
        //y轴、z轴绕x轴旋转
        y = rotateVector(y, x, obj.rotation.x);
        z = rotateVector(z, x, obj.rotation.x);
        //x轴、z轴绕y轴旋转
        x = rotateVector(x, y, obj.rotation.y);
        z = rotateVector(z, y, obj.rotation.y);
        //x轴、y轴绕z轴旋转
        x = rotateVector(x, z, obj.rotation.z);
        y = rotateVector(y, z, obj.rotation.z);
        return [
            [x.x, y.x, z.x],
            [x.y, y.y, z.y],
            [x.z, y.z, z.z]
        ];
    };


    /**
     * 将直角坐标转成屏幕坐标
     *
     * @param {number} x 直角坐标系x坐标
     * @param {number} y 直接坐标系y坐标
     * @param {number} width 屏幕显示区宽度
     * @param {number} height 屏幕显示区高度
     * @param {Array} trans 直角坐标系的平移向量，如[100, 100]
     * @param {number} scale 直角坐标系的缩放比例，scale越大，画出的图形越小
     * @param {number} rotate 直角坐标系的顺时针旋转角度(不是弧度)
     * @param {string} axis 映射到的坐标系，xoz|xoy|zoy
     * @return {Array} [x', y'] 点在屏幕上的坐标
     */
    tcMath.axis2screen = function (x, y, width, height, trans, scale, rotate, axis) {
        var sin, cos, x1, y1;
        trans = trans instanceof Array && trans.length === 2 ? trans : [0, 0];
        scale = scale || 1;
        rotate = rotate || 0;
        sin = Math.sin(Math.PI * rotate / 180);
        cos = Math.cos(Math.PI * rotate / 180);
        // 平移
        x = x - trans[0];
        y = y - trans[1];
        // 缩放
        x = x / scale;
        y = y / scale;
        // 旋转
        x1 = x * cos + y * sin;
        y1 = y * cos - x * sin;
        x = x1;
        y = y1;
        // 映射
        switch (axis) {
            case 'xoz':
                x = x + width * 0.5;
                y = y + height * 0.5;
                break;
            default:
                x = x + width * 0.5;
                y = height * 0.5 - y;
                break;
        }
        return [x, y];
    };


    /**
     * 将屏幕坐标映射成直角坐标系
     *
     * @param {number} x 屏幕坐标系x坐标
     * @param {number} y 屏幕坐标系y坐标
     * @param {number} width 屏幕显示区宽度
     * @param {number} height 屏幕显示区高度
     * @param {Array} trans 直角坐标系的平移向量，如[100, 100]
     * @param {number} scale 直角坐标系的缩放比例，scale越大，画出的图形越小
     * @param {number} rotate 直角坐标系的顺时针旋转角度(不是弧度)
     * @param {string} axis 映射到的坐标系，xoz|xoy|zoy
     * @return {Array} [x', y'] 点在直角坐标系的坐标
     */
    tcMath.screen2axis = function (x, y, width, height, trans, scale, rotate, axis) {
        var sin, cos, x1, y1;
        trans = trans instanceof Array && trans.length === 2 ? trans : [0, 0];
        scale = scale || 1;
        rotate = rotate || 0;
        sin = Math.sin(-Math.PI * rotate / 180);
        cos = Math.cos(-Math.PI * rotate / 180);
        // 映射
        switch (axis) {
            case 'xoz':
                x = x - width * 0.5;
                y = y - height * 0.5;
                break;
            default:
                x = x - width * 0.5;
                y = height * 0.5 - y;
                break;
        }
        // 旋转
        x1 = x * cos + y * sin;
        y1 = y * cos - x * sin;
        x = x1;
        y = y1;
        // 缩放
        x = x * scale;
        y = y * scale;
        // 平移
        x = x + trans[0];
        y = y + trans[1];
        return [x, y];
    };


    return tcMath;
});

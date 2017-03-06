/**
 * 2D物体
 */
define(function (require) {


    var _ = require('underscore');
    var math = require('../core/math');


    function arrayToAxis(arr) {
        return {
            x: arr[0],
            y: arr[1],
            z: arr[2]
        };
    }



    /**
     * 构造函数
     *
     * @param {object} param.mesh3d 3D物体
     */
    function Mesh2D(param) {
        _.extend(this, param);
        this.center = {x: 0, y: 0, z: 0};   // 物体本地坐标原点对应的世界坐标
        this.vertices = [];                 // 物体所有顶点的世界坐标
        this.update();
    }


    // 更新物体的绘制信息
    Mesh2D.prototype.update = function () {
        this.vertices = [];
        var mesh3d = this.mesh3d;
        var matrix = math.getRotateMatrix(mesh3d);
        var vertices = this.vertices;
        this.center = arrayToAxis(math.local2world(0, 0, 0, matrix, mesh3d));
        mesh3d.geometry.vertices.map(function (vector, index) {
            vertices.push(arrayToAxis(math.local2world(vector.x, vector.y, vector.z, matrix, mesh3d)));
        });
    };



    return Mesh2D;


});
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
        this.vertices = [];
        this.update();
    }


    // 更新物体的绘制信息
    Mesh2D.prototype.update = function () {
        this.vertices = [];
        var mesh3d = this.mesh3d;
        var matrix = math.getRotateMatrix(mesh3d);
        var vertices = this.vertices;
        mesh3d.geometry.vertices.map(function (vector, index) {
            vertices.push(arrayToAxis(math.local2world(vector.x, vector.y, vector.z, matrix, mesh3d)));
        });
    };



    return Mesh2D;


});
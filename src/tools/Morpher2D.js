define(function (require) {


    var _ = require('underscore');
    var handlerFactories = require('./common/handlerFactories');


    function getCameraPosition(me) {
        var cameraAngleA = me.cameraAngleA;
        var cameraAngleB = me.cameraAngleB;
        var cameraRadius = me.cameraRadius;
        var cameraLookAt = me.cameraLookAt;
        var y = cameraRadius * Math.sin(Math.PI * cameraAngleA / 180);
        var x = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.cos(Math.PI * cameraAngleB / 180);
        var z = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.sin(Math.PI * cameraAngleB / 180);
        return {
            x: x + cameraLookAt.x,
            y: y + cameraLookAt.y,
            z: z + cameraLookAt.z
        };
    }


    /**
     * 构造函数
     */
    function Morpher2D(param) {
        _.extend(this, param);
        this.mesh = null;
        this.joint = null;
        this.helpers = [];
        this.anchors = [];
        this.___containerMouseDownHandler___ = this.___containerMouseDownHandler___.bind(this);
        this.___containerMouseUpHandler___ = this.___containerMouseUpHandler___.bind(this);
        this.___containerMouseMoveHandler___ = this.___containerMouseMoveHandler___.bind(this);
        this.container.addEventListener('mousedown', this.___containerMouseDownHandler___);
    }


    Morpher2D.prototype.attach = function (mesh) {
        if (!mesh) {
            this.detach();
            return;
        }
        this.mesh = mesh;
        this.updateAnchors();
    };


    Morpher2D.prototype.detach = function () {
        while (this.helpers.length) this.helpers.pop().remove();
        while (this.anchors.length) this.anchors.pop().remove();
        this.mesh = null;
        this.joint = null;
    };


    Morpher2D.prototype.updateAnchors = function () {
        while (this.anchors.length) this.anchors.pop().remove();
        var me = this;
        var anchors = [];
        var points3D = [];
        var axis = this.axis;
        var vertices = this.mesh.geometry.vertices;
        var local2world = handlerFactories.local2world(me);
        var axis2screen = handlerFactories.math('axis2screen', me);
        var cameraPos = getCameraPosition(me);
        vertices.map(function (v, i) {
            points3D[i] = local2world(v.x, v.y, v.z);
            points3D[i].d = v.distanceTo(cameraPos);
            points3D[i].i = i;
            points3D[i].o = axis2screen(points3D[i][axis[0]], points3D[i][axis[1]]);
        });
        points3D.sort(function (a, b) {
            return a.d - b.d;
        });
        points3D.map(function (p, i) {
            anchors[i] = me.svg.circle(p.o[0], p.o[1], 5);
        });
        this.anchors = anchors;
    };


    Morpher2D.prototype.___containerMouseDownHandler___ = function (evt) {

    };


    Morpher2D.prototype.___containerMouseMoveHandler___ = function (evt) {

    };


    Morpher2D.prototype.___containerMouseUpHandler___ = function (evt) {

    };


    return Morpher2D;


});
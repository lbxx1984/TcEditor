/**
 * 2D变换工具
 */
define(function (require) {


    var _ = require('underscore');
    var renderer = require('./common/transformer2Drenderers');
    var processer = require('./common/transformer2Dprocessors');


    /**
     * 构造函数
     */
    function Transformer2D(param) {
        _.extend(this, param);
        this.mesh = null;
        this.helpers = [];
        this.___containerMouseDownHandler___ = this.___containerMouseDownHandler___.bind(this);
        this.___containerMouseUpHandler___ = this.___containerMouseUpHandler___.bind(this);
        this.___containerMouseMoveHandler___ = this.___containerMouseMoveHandler___.bind(this);
        this.container.addEventListener('mousedown', this.___containerMouseDownHandler___);
    }


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
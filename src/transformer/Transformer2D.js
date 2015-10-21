/**
 * 物体变换器2D
 * @author Haitao Li
 */
define(function (require) {


    var draggingEngine = {
        transform: {
            x: function (me, dMouse2D, dMouse3D) {
                each(me.helper, function (helper) {helper.translate(dMouse2D[0], 0);});
                me.mesh.translate(dMouse2D[0], 0);
                me.stage.renderMesh();
                var geo = me.mesh.mesh;
                geo.position.x += dMouse3D[0];
                geo.geometry.verticesNeedUpdate = true;
            },
            y: function (me, dMouse2D, dMouse3D) {
                each(me.helper, function (helper) {helper.translate(0, dMouse2D[1]);});
                me.mesh.translate(0, dMouse2D[1]);
                me.stage.renderMesh();
            },
            c: function (me, dMouse2D, dMouse3D) {
                each(me.helper, function (helper) {helper.translate(dMouse2D[0], dMouse2D[1]);});
                me.mesh.translate(dMouse2D[0], dMouse2D[1]);
                me.stage.renderMesh();
            }
        }
    };


    function each(arr, func) {
        for (var i = 0; i < arr.length; i++) {
            func(arr[i]);
        }
    }


    /**
     * 拖动
     *
     * @param {Array.<number>} dMouse2D 2D Dom层面鼠标增量
     * @param {Array.<number>} dMouse3D 3D空间鼠标增量
     */
    Transformer2D.prototype.dragging = function (dMouse2D, dMouse3D) {
        if (this.mesh == null || this.command == null) {
            return;
        }
        draggingEngine[this.mode][this.command](this, dMouse2D, dMouse3D);
    };


    /**
     * 绑定物体
     * @param {Object3D} mesh 3D物体
     */
    Transformer2D.prototype.attach = function (mesh) {
        this.mesh = this.stage.children[mesh.uuid];
        this.clearHelper();
        this.render();
    };


    /**
     * 卸载物体
     */
    Transformer2D.prototype.detach = function () {
        this.mesh = null;
        this.command = null;
        this.clearHelper();
    };


    /**
     * 绘制helper
     */
    Transformer2D.prototype.render = function () {
        if (!this.mesh) return;
        var center = this.mesh.center;
        var colors = this.stage.param.colors[this.stage.param.eyes];
        var hoverColor = this.stage.param.meshHoverColor;
        var x = center[0];
        var y = center[1];
        var size = this.param.renderSize + this.param.scale * this.param.floatSize;
        var me = this;

        switch (this.mode) {
            case 'transform': drawTransform(); break;
            default: break;
        }

        function drawTransform() {
            me.helper[0] = me.svg.path([
                ['M', x, y + 2], ['L', x + size - 10, y + 2], ['L', x + size - 10, y + 6],
                ['L', x + size, y], ['L', x + size - 10, y - 6], ['L', x + size - 10, y - 2],
                ['L', x, y - 2], ['M', x, y + 2]
            ]).attr({
                fill: colors[0],
                cursor: 'e-resize'
            }).mousedown(function () {
                me.command = 'x'
            });
            me.helper[1] = me.svg.path([
                ['M', x + 2, y], ['L', x + 2, y + size - 10], ['L', x + 6, y + size - 10],
                ['L', x, y + size], ['L', x - 6, y + size - 10], ['L', x - 2, y + size - 10],
                ['L', x - 2, y], ['M', x + 2, y]
            ]).attr({
                cursor: 's-resize',
                fill: colors[1]
            }).mousedown(function () {
                me.command = 'y';
            });
            me.helper[2] = me.svg.circle(x, y, 5).attr({
                fill: hoverColor,
                cursor: 'move'
            }).mousedown(function () {
                me.command = 'c';
            });
        }
    };


    /**
     * 移除所有helper
     */
    Transformer2D.prototype.clearHelper = function () {
        while (this.helper.length > 0) {
            this.helper.pop().remove();
        }
    };


    /**
     * 构造函数
     *
     * @constructor
     * @param {Object} param 初始化对象
     * @param {Stage2D} param.stage 2D舞台对象
     */
    function Transformer2D(param) {
        this.stage = param.stage;
        this.svg = param.stage.helperRender;
        this.mode = 'transform';
        this.command = null;
        this.param = {
            scale: 0.5, // [0, 2]
            renderSize: 50,
            floatSize: 50, // finalSize = renderSize + scale * floatSize 
        };
        this.mesh = null;
        this.helper = [];
    }

    return Transformer2D;

});

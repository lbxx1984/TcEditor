/**
 * 物体变换器2D
 * @author Haitao Li
 */
define(function (require) {


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
            me.helper[0] = me.svg.path([ // x
                ['M', x, y + 2],
                ['L', x + size - 10, y + 2],
                ['L', x + size - 10, y + 6],
                ['L', x + size, y],
                ['L', x + size - 10, y - 6],
                ['L', x + size - 10, y - 2],
                ['L', x, y - 2],
                ['M', x, y + 2]
            ]).attr({'fill': colors[0]});
            me.helper[1] = me.svg.path([
                ['M', x + 2, y],
                ['L', x + 2, y + size - 10],
                ['L', x + 6, y + size - 10],
                ['L', x, y + size],
                ['L', x - 6, y + size - 10],
                ['L', x - 2, y + size - 10],
                ['L', x - 2, y],
                ['M', x + 2, y]
            ]).attr({'fill': colors[1]});
            me.helper[2] = me.svg.circle(x, y, 5).attr({'fill': hoverColor});

            me.helper[0][0].tcEditorCmd = 'x';
            me.helper[1][0].tcEditorCmd = 'y';
            me.helper[2][0].tcEditorCmd = 'c';
            me.helper[0][0].tcEditorCursor = 'eResize';
            me.helper[1][0].tcEditorCursor = 'sResize';
            me.helper[2][0].tcEditorCursor = 'move';

            //console.log(me.helper[0][0].tcEditorCmd);
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

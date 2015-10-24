define(function (require) {

    /**
     * @constructor
     */
    function Morpher2D(param) {
        var me = this;
        this.stage = param.stage;
        this.svg = param.stage.helperRender;
        this.helperColor = param.helperColor || '#d97915';
        this.helperHoverColor = param.helperHoverColor || '#ffff00';
        this.param = {
            scale: 0.5, // [0, 2]
            renderSize: 50,
            floatSize: 50, // finalSize = renderSize + scale * floatSize 
        };

        this.joints = []; // 存放关节svg
        this.helper = [];   // 存放关节控制器svg
        this.geo = null; // 当前绑定的物体
        this.hover = null; // 鼠标当前经过的关节
        this.joint = null; // 当前绑定的关节
        this.command = null; // 当前关节操作命令

        this.stage.param.container.addEventListener('rendered', function () {
            if (me.geo == null) return;
            me.attach(me.geo.mesh);
            if (me.joint == null) return;
            me.attachJoint(me.joint);
        });
    }


    Morpher2D.prototype.attach = function (mesh) {
        this.geo = this.stage.children[mesh.uuid];
        this.render();
    };


    Morpher2D.prototype.detach = function () {
        this.geo = null;
        this.joint = null;
        this.clear();
        this.clearTransformer();
    };


    Morpher2D.prototype.attachJoint = function (jointIndex) {
        if (isNaN(jointIndex) || jointIndex > this.joints.length) return;
        this.joint = jointIndex;
        this.renderTransformer();
    };


    Morpher2D.prototype.detachJoint = function () {
        this.joint = null;
        this.clearTransformer();
    };


    Morpher2D.prototype.clear = function () {
        while(this.joints.length > 0) {
            this.joints.shift().remove();
        }
    };


    Morpher2D.prototype.clearTransformer = function () {
        while(this.helper.length > 0) {
            this.helper.shift().remove();
        }
    };


    Morpher2D.prototype.render = function () {
        this.clear();
        if (!this.geo) return;
        // 添加关节
        var me = this;
        for (var n = 0; n < this.geo.vertices.length; n++) {
            var vector = this.geo.vertices[n];
            var joint = this.svg
                .circle(vector[0], vector[1], 5)
                .attr({fill: this.helperColor})
                .mouseover((function (index) {
                    return function () {
                        this.attr({fill: me.helperHoverColor});
                        me.hover = index;
                    }
                })(n))
                .mouseout((function (index) {
                    return function () {
                        this.attr({fill: me.helperColor});
                        me.hover = null;
                    }
                })(n))
            this.joints.push(joint);
        }
    };


    Morpher2D.prototype.renderTransformer = function () {
        if (!this.geo || this.joint == null) return;

        var center = this.geo.vertices[this.joint];
        var colors = this.stage.param.colors[this.stage.param.eyes];
        var hoverColor = this.stage.param.meshHoverColor;
        var x = center[0];
        var y = center[1];
        var size = this.param.renderSize + this.param.scale * this.param.floatSize;
        var me = this;

        me.clearTransformer();
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
    };


    Morpher2D.prototype.hoverJoint = function () {};


    return Morpher2D;
});
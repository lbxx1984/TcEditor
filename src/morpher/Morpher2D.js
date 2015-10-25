define(['math'], function (math) {


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
        this.geo = null; // 当前绑定的物体3D
        this.hover = null; // 鼠标当前经过的关节
        this.joint = null; // 当前绑定的关节索引
        this.command = null; // 当前关节操作命令

        this.stage.param.container.addEventListener('rendered', function () {
            if (me.geo == null) return;
            me.attach(me.geo);
            if (me.joint == null) return;
            me.attachJoint(me.joint);
        });
    }


    Morpher2D.prototype.dragging = function (d2, d3) {
        if (this.geo == null || this.joint == null || this.command == null) return;
        // 2D
        d2[0] = this.command === 'y' ? 0 : d2[0];
        d2[1] = this.command === 'x' ? 0 : d2[1];
        this.helper[0].translate(d2[0], d2[1]);
        this.helper[1].translate(d2[0], d2[1]);
        this.helper[2].translate(d2[0], d2[1]);
        this.joints[this.joint].translate(d2[0], d2[1]);
        // 3D
        var mesh3d = this.geo;
        var view = this.stage.param.eyes;
        var cmd = this.command;
        var vector = mesh3d.geometry.vertices[this.joint];
        var matrix = math.rotateMatrix(mesh3d);
        var world = math.Local2Global(vector.x, vector.y, vector.z, matrix, mesh3d);
        world[0] += 'xozx;xozc;xoyx;xoyc;'.indexOf(view + cmd + ';') > -1 ? d3[0] : 0;
        world[1] += 'xoyy;xoyc;zoyy;zoyc;'.indexOf(view + cmd + ';') > -1 ? d3[1] : 0;
        world[2] += 'zoyx;zoyc;xozy;xozc;'.indexOf(view + cmd + ';') > -1 ? d3[2] : 0;
        var local = math.Global2Local(world[0], world[1], world[2], mesh3d);
        vector.x = local[0];
        vector.y = local[1];
        vector.z = local[2];
        // redraw
        mesh3d.geometry.verticesNeedUpdate = true;
        this.stage.children[this.geo.uuid].reset();
        this.stage.renderMesh();
    };


    Morpher2D.prototype.attach = function (mesh) {
        this.geo = mesh;
        this.render();
    };


    Morpher2D.prototype.detach = function () {
        this.geo = null;
        this.joint = null;
        this.clear();
        this.clearTransformer();
    };


    Morpher2D.prototype.attachJoint = function (jointIndex) {
        this.joint = jointIndex;
        if (isNaN(jointIndex) || jointIndex > this.joints.length) return;
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
        if (!this.geo || !this.stage.children[this.geo.uuid]) return;
        // 添加关节
        var me = this;
        var geo2d = this.stage.children[this.geo.uuid];
        for (var n = 0; n < geo2d.vertices.length; n++) {
            var vector = geo2d.vertices[n];
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
        if (!this.geo || this.joint == null || !this.stage.children[this.geo.uuid]) return;

        var center = this.stage.children[this.geo.uuid].vertices[this.joint];
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
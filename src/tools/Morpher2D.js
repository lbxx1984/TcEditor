define(function (require) {


    const _ = require('underscore');
    const math = require('../core/math');
    const handlerFactories = require('./common/handlerFactories');
    const AXIS_COLOR = {
        x: '#FF0000',
        y: '#00FF00',
        z: '#0000FF',
        xz: 'rgba(255,0,0,0.3)',
        xy: 'rgba(255,255,0,0.3)',
        zy: 'rgba(0,255,0,0.3)',
        xoz: 'rgba(0,255,0,0.8)',
        xoy: 'rgba(0,0,255,0.8)',
        yoz: 'rgba(255,0,0,0.8)',
    };


    // 获取摄像机位置
    function getCameraPosition(me) {
        let cameraAngleA = me.cameraAngleA;
        let cameraAngleB = me.cameraAngleB;
        let cameraRadius = me.cameraRadius;
        let cameraLookAt = me.cameraLookAt;
        let y = cameraRadius * Math.sin(Math.PI * cameraAngleA / 180);
        let x = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.cos(Math.PI * cameraAngleB / 180);
        let z = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.sin(Math.PI * cameraAngleB / 180);
        return {
            x: x + cameraLookAt.x,
            y: y + cameraLookAt.y,
            z: z + cameraLookAt.z
        };
    }


    // 绘制箭头
    function arrow(axis, info, size) {
        let x0 = info.o[0];
        let y0 = info.o[1];
        let x1 = info[axis][0];
        let y1 = info[axis][1];
        let sin = info['sin' + axis];
        let cos = info['cos' + axis];
        let r = 2;
        d = 100 * size;
        x1 = d * sin + x0;
        y1 = d * cos + y0;
        return [
            ['M', x0 + r * cos, y0 - r * sin],
            ['L', x1 + r * cos, y1 - r * sin],
            ['L', x1 + 3 * r * cos, y1 - 3 * r * sin],
            ['L', (3 * r + d) * sin + x0, (3 * r + d) * cos + y0],
            ['L', x1 - 3 * r * cos, y1 + 3 * r * sin],
            ['L', x1 - r * cos, y1 + r * sin],
            ['L', x0 - r * cos, y0 + r * sin],
            ['L', x0 + r * cos, y0 - r * sin],
            ['M', x0 + r * cos, y0 - r * sin]
        ];
    }


    // 绘制操作面
    function face(info, size, ruleA, ruleB) {
        ruleA = ruleA || 'a';
        ruleB = ruleB || 'b';
        let x0 = info.o[0];
        let y0 = info.o[1];
        let x1 = info[ruleA][0];
        let y1 = info[ruleA][1];
        let x2 = info[ruleB][0];
        let y2 = info[ruleB][1];
        let x3 = 0;
        let y3 = 0;
        let sina = info['sin' + ruleA];
        let cosa = info['cos' + ruleA];
        let sinb = info['sin' + ruleB];
        let cosb = info['cos' + ruleB];
        d1 = 50 * size;
        d2 = 50 * size;
        x1 = d1 * sina + x0;
        y1 = d1 * cosa + y0;
        x2 = d2 * sinb + x0;
        y2 = d2 * cosb + y0;
        x3 = d1 * sina + d2 * sinb + x0;
        y3 = d1 * cosa + d2 * cosb + y0;
        return [
            ['M', x0, y0],
            ['L', x1, y1],
            ['L', x3, y3],
            ['L', x2, y2],
            ['M', x0, y0]
        ];
    }


    function anchorMouseHandler(arr) {
        arr.map(function (item) {
            item.attr('cursor', 'pointer').mouseover(function() {
                this.___fill___ = this.attr('fill');
                this.attr('fill', '#FFFF00');
            }).mouseout(function() {
                this.attr('fill', this.___fill___);
            });
        });
    }


    function mousedownHandler(me, cmd) {
        return function () {
            me.command = cmd;
        };
    }


    /**
     * 构造函数
     */
    function Morpher2D(param) {
        _.extend(this, param);
        this.mesh = null;
        this.anchor = null;
        this.index = null;
        this.hoverIndex = null;
        this.helpers = [];
        this.points = [];
        this.mouseX = -999;
        this.mouseY = -999;
        this.isDragging = false;
        this.___containerMouseDownHandler___ = this.___containerMouseDownHandler___.bind(this);
        this.___containerMouseUpHandler___ = this.___containerMouseUpHandler___.bind(this);
        this.___containerMouseMoveHandler___ = this.___containerMouseMoveHandler___.bind(this);
    }


    Morpher2D.prototype.attach = function (mesh) {
        if (!mesh) {
            this.detach();
            return;
        }
        this.mesh = mesh;
        this.updateAnchors();
        this.container.addEventListener('mousemove', this.___containerMouseMoveHandler___);
        this.container.addEventListener('mousedown', this.___containerMouseDownHandler___);
        this.container.addEventListener('mouseup', this.___containerMouseUpHandler___);
    };


    Morpher2D.prototype.detach = function () {
        while (this.helpers.length) this.helpers.pop().remove();
        this.mesh = null;
        this.anchor = null;
        this.hoverIndex = null;
        this.index = null;
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        const ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        this.container.removeEventListener('mousemove', this.___containerMouseMoveHandler___);
        this.container.removeEventListener('mousedown', this.___containerMouseDownHandler___);
        this.container.removeEventListener('mouseup', this.___containerMouseUpHandler___);
    };


    Morpher2D.prototype.attachAnchor = function (index) {
        let me = this;
        this.index = index;
        this.anchor = null;
        this.points.map(function (p) {
            me.anchor = p.i === index ? p : me.anchor;
        });
        this.updateSelectedAnchor();
    };


    Morpher2D.prototype.updateAnchors = function (mouseX, mouseY) {

        const local2world = handlerFactories.local2world(this);
        const axis2screen = handlerFactories.math('axis2screen', this);
        const cameraPos = getCameraPosition(this);

        const axis = this.axis;
        const size = 4 * 1000 / this.size;

        let color = this.color.toString(16); while(color.length < 6) color = '0' + color; color = '#' + color;
        let points = [];
        let hoverIndex = null;

        this.mesh.geometry.vertices.map(function (v, i) {
            points[i] = local2world(v.x, v.y, v.z);
            points[i].d = v.distanceTo(cameraPos);
            points[i].i = i;
            points[i].o = axis2screen(points[i][axis[0]], points[i][axis[1]]);
        });
        points.sort((a, b) => a.d - b.d);

        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        const ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        ctx.clearRect(0, 0, width, height);

        points.map(function (p, i) {
            ctx.beginPath();
            ctx.arc(p.o[0], p.o[1], size, 0, 2 * Math.PI, false);
            let inMouseIn = mouseX !== undefined && mouseY !== undefined ? ctx.isPointInPath(mouseX, mouseY) : false;
            ctx.fillStyle = inMouseIn ? 'yellow' : color;
            ctx.strokeStyle = '#000';
            hoverIndex = inMouseIn ? p.i : hoverIndex;
            ctx.fill();
            ctx.stroke();
        });

        this.points = points;

        return hoverIndex;
    };


    Morpher2D.prototype.updateSelectedAnchor = function () {
        while (this.helpers.length) this.helpers.pop().remove();
        if (!this.anchor) return;
        let me = this;
        let anchor = this.anchor;
        let axis = this.axis;
        let axis2screen = handlerFactories.math('axis2screen', me);
        let o = {x: anchor.x, y: anchor.y, z: anchor.z};
        let a = {x: o.x, y: o.y, z: o.z}; a[axis[0]] += 100; a = axis2screen(a[axis[0]], a[axis[1]]);
        let b = {x: o.x, y: o.y, z: o.z}; b[axis[1]] += 100; b = axis2screen(b[axis[0]], b[axis[1]]); 
        o = axis2screen(o[axis[0]], o[axis[1]]);
        let d1 = Math.sqrt((o[0] - a[0]) * (o[0] - a[0]) + (o[1] - a[1]) * (o[1] - a[1]));
        let d2 = Math.sqrt((o[0] - b[0]) * (o[0] - b[0]) + (o[1] - b[1]) * (o[1] - b[1]));
        let info = {
            o: o, a: a, b: b,
            sina: (a[0] - o[0]) / d1,
            cosa: (a[1] - o[1]) / d1,
            sinb: (b[0] - o[0]) / d2,
            cosb: (b[1] - o[1]) / d2,
            screen2axis: handlerFactories.math('screen2axis', me)
        };
        let size = 1000 / me.size;
        this.helpers[0] = me.svg.path(face(info, size)).attr('fill', AXIS_COLOR[axis.join('')])
            .mousedown(mousedownHandler(me, 'o'));
        this.helpers[1] = me.svg.path(arrow('a', info, size)).attr('fill', AXIS_COLOR[axis[0]])
            .mousedown(mousedownHandler(me, axis[0]));
        this.helpers[2] = me.svg.path(arrow('b', info, size)).attr('fill', AXIS_COLOR[axis[1]])
            .mousedown(mousedownHandler(me, axis[1]));
        this.helpInfo = info;
        anchorMouseHandler(this.helpers);
    };


    Morpher2D.prototype.___containerMouseDownHandler___ = function (evt) {
        if (!this.mesh) return;
        this.mouseX = evt.clientX;
        this.mouseY = evt.clientY;
    };


    Morpher2D.prototype.___containerMouseMoveHandler___ = function (evt) {
        this.hoverIndex = this.updateAnchors(evt.layerX, evt.layerY);
        if (!this.mesh || !this.command || !this.anchor) return;
        let dx = evt.clientX - this.mouseX;
        let dy = evt.clientY - this.mouseY;
        this.mouseX = evt.clientX;
        this.mouseY = evt.clientY;
        let info = this.helpInfo;
        let p = this.anchor;
        let d1 = (info.cosb * dx - info.sinb * dy) / (info.sina * info.cosb - info.sinb * info.cosa);
        let d2 = (info.cosa * dx - info.sina * dy) / (info.cosa * info.sinb - info.cosb * info.sina);
        d1 = this.command === this.axis[1] ? 0 : d1;
        d2 = this.command === this.axis[0] ? 0 : d2;
        dx = d1 * info.sina + d2 * info.sinb;
        dy = d1 * info.cosa + d2 * info.cosb;
        let center = info.screen2axis(info.o[0], info.o[1]);
        let to = info.screen2axis(info.o[0] + dx, info.o[1] + dy);
        let d3 = {x: 0, y: 0, z: 0};
        d3[this.axis[0]] = to[0] - center[0];
        d3[this.axis[1]] = to[1] - center[1];
        let local = math.world2local(p.x + d3.x, p.y + d3.y, p.z + d3.z, this.mesh);
        this.mesh.geometry.vertices[this.anchor.i].x = local[0];
        this.mesh.geometry.vertices[this.anchor.i].y = local[1];
        this.mesh.geometry.vertices[this.anchor.i].z = local[2];
        this.mesh.geometry.verticesNeedUpdate = true;
        if (this.selectedVector) {
            p = this.selectedVector.position;
            this.selectedVector.position.set(p.x + d3.x, p.y + d3.y, p.z + d3.z);
        }
        this.isDragging = true;
        typeof this.onObjectChange === 'function' && this.onObjectChange();
    };


    Morpher2D.prototype.___containerMouseUpHandler___ = function (evt) {
        !this.isDragging && this.hoverIndex != null && typeof this.onAnchorClick === 'function' && this.onAnchorClick(this.hoverIndex);
        this.command = '';
        this.isDragging = false;
        this.hoverIndex = null;
    };


    return Morpher2D;


});
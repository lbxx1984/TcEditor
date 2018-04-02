/**
 * 2D骨骼编辑器
 */

import {world2local} from 'core/math';
import wrapLocal2worldFunction from './util/wrapLocal2worldFunction';
import wrapMathFunction from './util/wrapMathFunction';


const AXIS_COLOR = {
    x: '#FF0000',
    y: '#00FF00',
    z: '#0000FF',
    xz: 'rgba(255,0,0,0.3)',
    xy: 'rgba(255,255,0,0.3)',
    zy: 'rgba(0,255,0,0.3)',
    xoz: 'rgba(0,255,0,0.8)',
    xoy: 'rgba(0,0,255,0.8)',
    yoz: 'rgba(255,0,0,0.8)'
};


// 绘制箭头
function arrow(axis, info, size) {
    let x0 = info.o[0];
    let y0 = info.o[1];
    let x1 = info[axis][0];
    let y1 = info[axis][1];
    let sin = info['sin' + axis];
    let cos = info['cos' + axis];
    let r = 2;
    let d = 100 * size;
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
    let d1 = 50 * size;
    let d2 = 50 * size;
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


function containerMouseDownHandler(evt) {
    if (!this.mesh) return;
    this.mouseX = evt.clientX;
    this.mouseY = evt.clientY;
}

function containerMouseUpHandler() {
    !this.isDragging && this.hoverIndex != null && typeof this.onAnchorClick === 'function'
        && this.onAnchorClick(this.hoverIndex);
    this.command = '';
    this.isDragging = false;
    this.hoverIndex = null;
}

function containerMouseMoveHandler(evt) {
    this.hoverIndex = this.updateAnchors(evt.layerX, evt.layerY);
    if (!this.mesh || !this.command || !this.anchor) return;
    let dx = evt.clientX - this.mouseX;
    let dy = evt.clientY - this.mouseY;
    this.mouseX = evt.clientX;
    this.mouseY = evt.clientY;
    const info = this.helpInfo;
    const p = this.anchor;
    let d1 = (info.cosb * dx - info.sinb * dy) / (info.sina * info.cosb - info.sinb * info.cosa);
    let d2 = (info.cosa * dx - info.sina * dy) / (info.cosa * info.sinb - info.cosb * info.sina);
    d1 = this.command === this.axis[1] ? 0 : d1;
    d2 = this.command === this.axis[0] ? 0 : d2;
    dx = d1 * info.sina + d2 * info.sinb;
    dy = d1 * info.cosa + d2 * info.cosb;
    const center = info.screen2axis(info.o[0], info.o[1]);
    let to = info.screen2axis(info.o[0] + dx, info.o[1] + dy);
    let d3 = {x: 0, y: 0, z: 0};
    d3[this.axis[0]] = to[0] - center[0];
    d3[this.axis[1]] = to[1] - center[1];
    let local = world2local(p.x + d3.x, p.y + d3.y, p.z + d3.z, this.mesh);
    let vertices = this.mesh.geometry.vertices;
    let index = this.anchor.i;
    let indexArr = this.mesh.tc.vectorLinkHash && this.mesh.tc.vectorLinkHash[index]
        ? [index].concat(this.mesh.tc.vectorLinkHash[index]) : [index];
    indexArr.map(function (i) {
        vertices[i].x = local[0];
        vertices[i].y = local[1];
        vertices[i].z = local[2];
    });
    this.mesh.geometry.verticesNeedUpdate = true;
    this.isDragging = true;
    typeof this.onObjectChange === 'function' && this.onObjectChange();
}

function anchorMouseDownHandlerFactory(me, cmd) {
    return function () {
        me.command = cmd;
    };
}

function anchorSorterFactory(me) {
    const stageInfo = {
        v: me.axis.join('o'),
        a: me.cameraAngleA,
        b: (me.cameraAngleB % 360 + 360) % 360
    };
    let type = 'x';
    let value = 1;
    switch (stageInfo.v) {
        case 'xoz':
            type = 'y';
            value = stageInfo.a >= 0 ? 1 : -1;
            break;
        case 'xoy':
            type = 'z';
            value = stageInfo.b <= 180 ? 1 : -1;
            break;
        case 'zoy':
            type = 'x';
            value = stageInfo.b <= 90 || stageInfo.b >= 315 ? 1 : -1;
            break;
        default:
            break;
    }
    return function (v) {
        return value * v[type];
    };
}

function wrapAnchorMouseCommonHandler(arr) {
    arr.map(item => {
        item.attr('cursor', 'pointer').mouseover(function() {
            this.fill = this.attr('fill');
            this.attr('fill', '#FFFF00');
        }).mouseout(function() {
            this.attr('fill', this.fill);
        });
    });
}


export default class Morpher2D {

    constructor(param) {
        Object.assign(this, param, {
            mesh: null,
            anchor: null,
            index: null,
            hoverIndex: null,
            helpers: [],
            points: [],
            mouseX: -999,
            mouseY: -999,
            isDragging: false,
            containerMouseDownHandler: containerMouseDownHandler.bind(this),
            containerMouseUpHandler: containerMouseUpHandler.bind(this),
            containerMouseMoveHandler: containerMouseMoveHandler.bind(this)
        });
    }

    attach(mesh) {
        if (!mesh) {
            this.detach();
            return;
        }
        this.mesh = mesh;
        this.updateAnchors();
        this.container.addEventListener('mousemove', this.containerMouseMoveHandler);
        this.container.addEventListener('mousedown', this.containerMouseDownHandler);
        this.container.addEventListener('mouseup', this.containerMouseUpHandler);
    }

    detach() {
        if (!this.mesh) return;
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
        this.container.removeEventListener('mousemove', this.containerMouseMoveHandler);
        this.container.removeEventListener('mousedown', this.containerMouseDownHandler);
        this.container.removeEventListener('mouseup', this.containerMouseUpHandler);
    }

    attachAnchor(index) {
        this.index = index;
        this.anchor = null;
        this.points.map(p => {
            this.anchor = p.i === index ? p : this.anchor;
        });
        this.updateSelectedAnchor();
    }

    updateAnchors(mouseX, mouseY) {
        const local2world = wrapLocal2worldFunction(this);
        const axis2screen = wrapMathFunction('axis2screen', this);
        const axis = this.axis;
        const size = 4 * 1000 / this.size;
        const distance = anchorSorterFactory(this);
        const points = [];
        let color = this.color.toString(16);
        while(color.length < 6) color = '0' + color; color = '#' + color;
        let hoverIndex = null;
        this.mesh.geometry.vertices.map(function (v, i) {
            points[i] = local2world(v.x, v.y, v.z);
            points[i].d = distance(points[i]);
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
        points.map(p => {
            ctx.beginPath();
            ctx.arc(p.o[0], p.o[1], size, 0, 2 * Math.PI, false);
            const inMouseIn = mouseX !== undefined && mouseY !== undefined ? ctx.isPointInPath(mouseX, mouseY) : false;
            ctx.fillStyle = inMouseIn ? 'yellow' : color;
            ctx.strokeStyle = '#000';
            hoverIndex = inMouseIn ? p.i : hoverIndex;
            ctx.fill();
            ctx.stroke();
        });

        this.points = points;

        return hoverIndex;
    }

    updateSelectedAnchor() {
        if (!this.mesh) return;
        while (this.helpers.length)
            this.helpers.pop().remove();
        if (!this.anchor) return;
        const {anchor, axis} = this;
        const size = 1000 / this.size;
        const axis2screen = wrapMathFunction('axis2screen', this);
        let o = {x: anchor.x, y: anchor.y, z: anchor.z};
        let a = {x: o.x, y: o.y, z: o.z}; a[axis[0]] += 100; a = axis2screen(a[axis[0]], a[axis[1]]);
        let b = {x: o.x, y: o.y, z: o.z}; b[axis[1]] += 100; b = axis2screen(b[axis[0]], b[axis[1]]); 
        o = axis2screen(o[axis[0]], o[axis[1]]);
        const d1 = Math.sqrt((o[0] - a[0]) * (o[0] - a[0]) + (o[1] - a[1]) * (o[1] - a[1]));
        const d2 = Math.sqrt((o[0] - b[0]) * (o[0] - b[0]) + (o[1] - b[1]) * (o[1] - b[1]));
        const info = {
            o, a, b,
            sina: (a[0] - o[0]) / d1,
            cosa: (a[1] - o[1]) / d1,
            sinb: (b[0] - o[0]) / d2,
            cosb: (b[1] - o[1]) / d2,
            screen2axis: wrapMathFunction('screen2axis', this)
        };
        this.helpers[0] = this.svg.path(face(info, size)).attr('fill', AXIS_COLOR[axis.join('')])
            .mousedown(anchorMouseDownHandlerFactory(this, 'o'));
        this.helpers[1] = this.svg.path(arrow('a', info, size)).attr('fill', AXIS_COLOR[axis[0]])
            .mousedown(anchorMouseDownHandlerFactory(this, axis[0]));
        this.helpers[2] = this.svg.path(arrow('b', info, size)).attr('fill', AXIS_COLOR[axis[1]])
            .mousedown(anchorMouseDownHandlerFactory(this, axis[1]));
        this.helpInfo = info;
        wrapAnchorMouseCommonHandler(this.helpers);
    }

}

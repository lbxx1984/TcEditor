import wrapMathFunction from '../util/wrapMathFunction';
import wrapLocal2worldFunction from '../util/wrapLocal2worldFunction';
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


function arrow(axis, info, size) {
    const x0 = info.o[0];
    const y0 = info.o[1];
    let x1 = info[axis][0];
    let y1 = info[axis][1];
    const sin = info['sin' + axis];
    const cos = info['cos' + axis];
    const r = 2;
    const d = 100 * size;
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

function face(info, size, ruleA, ruleB) {
    ruleA = ruleA || 'a';
    ruleB = ruleB || 'b';
    const x0 = info.o[0];
    const y0 = info.o[1];
    let x1 = info[ruleA][0];
    let y1 = info[ruleA][1];
    let x2 = info[ruleB][0];
    let y2 = info[ruleB][1];
    let x3 = 0;
    let y3 = 0;
    const sina = info['sin' + ruleA];
    const cosa = info['cos' + ruleA];
    const sinb = info['sin' + ruleB];
    const cosb = info['cos' + ruleB];
    const d1 = 50 * size;
    const d2 = 50 * size;
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

function circle(points) {
    return [].concat(points, [points[0]]).map((p, i) => {
        return [i === 0 ? 'M' : 'L', p[0], p[1]];
    });
}


function attachCommonMouseHandler(arr, cursor, type) {
    arr.map(item => {
        item.attr('cursor', cursor).mouseover(function() {
            this['___' + type + '___'] = this.attr(type);
            this.attr(type, '#FFFF00');
        }).mouseout(function() {
            this.attr(type, this['___' + type + '___']);
        });
    });
}

function mousedownHandlerFactory(cmd, me) {
    return function () {
        me.command = cmd;
    }
}


function drawWorldTranslator(info, me) {
    const axis = me.axis;
    return [
        me.svg.path(face(info, me.size))
            .attr({fill: AXIS_COLOR[axis.join('')]})
            .mousedown(mousedownHandlerFactory('o', me)),
        me.svg.path(arrow('a', info, me.size))
            .attr({fill: AXIS_COLOR[axis[0]]})
            .mousedown(mousedownHandlerFactory(axis[0], me)),
        me.svg.path(arrow('b', info, me.size))
            .attr({fill: AXIS_COLOR[axis[1]]})
            .mousedown(mousedownHandlerFactory(axis[1], me))
    ];
}

function drawLocalTranslator(info, me) {
    const a = arrow('a', info, me.size);
    const b = arrow('b', info, me.size);
    const c = arrow('c', info, me.size);
    const arr = [];
    if (available(a)) {
        arr.push(me.svg.path(a).attr({fill: AXIS_COLOR.x}).mousedown(mousedownHandlerFactory('a', me)));
    }
    if (available(b)) {
        arr.push(me.svg.path(b).attr({fill: AXIS_COLOR.y}).mousedown(mousedownHandlerFactory('b', me)));
    }
    if (available(c)) {
        arr.push(me.svg.path(c).attr({fill: AXIS_COLOR.z}).mousedown(mousedownHandlerFactory('c', me)));
    }
    return arr;
    function available(data) {
        const str = JSON.stringify(data).toLowerCase();
        return str.indexOf('null') < 0 && str.indexOf('nan') < 0;
    }
}

function drawLocalRotater(info, me) {
    const style = {'stroke-width': 3};
    return info.faces.map(item => {
        return me.svg.path(circle(item[0])).attr(style).attr({stroke: item[1]})
            .mousedown(mousedownHandlerFactory(item[2], me));
    });
}


function worldTranslator(me) {
    const axis = me.axis;
    const axis2screen = wrapMathFunction('axis2screen', me);
    const local2world = wrapLocal2worldFunction(me);
    let o = local2world(0, 0, 0);
    let a = {x: o.x, y: o.y, z: o.z}; a[axis[0]] += 100; a = axis2screen(a[axis[0]], a[axis[1]]);
    let b = {x: o.x, y: o.y, z: o.z}; b[axis[1]] += 100; b = axis2screen(b[axis[0]], b[axis[1]]); 
    o = axis2screen(o[axis[0]], o[axis[1]]);
    const d1 = Math.sqrt((o[0] - a[0]) * (o[0] - a[0]) + (o[1] - a[1]) * (o[1] - a[1]));
    const d2 = Math.sqrt((o[0] - b[0]) * (o[0] - b[0]) + (o[1] - b[1]) * (o[1] - b[1]));
    me.helpInfo = {
        o, a, b,
        sina: (a[0] - o[0]) / d1,
        cosa: (a[1] - o[1]) / d1,
        sinb: (b[0] - o[0]) / d2,
        cosb: (b[1] - o[1]) / d2,
        axis2screen: axis2screen,
        local2world: local2world,
        screen2axis: wrapMathFunction('screen2axis', me)
    };
    me.helpers = drawWorldTranslator(me.helpInfo, me); 
    attachCommonMouseHandler(me.helpers, 'pointer', 'fill');
}

function localTranslator(me) {
    const axis = me.axis;
    const axis2screen = wrapMathFunction('axis2screen', me);
    const local2world = wrapLocal2worldFunction(me);
    let o = local2world(0, 0, 0); o = axis2screen(o[axis[0]], o[axis[1]]);
    let a = local2world(100, 0, 0); a = axis2screen(a[axis[0]], a[axis[1]]);
    let b = local2world(0, 100, 0); b = axis2screen(b[axis[0]], b[axis[1]]);
    let c = local2world(0, 0, 100); c = axis2screen(c[axis[0]], c[axis[1]]); 
    const d1 = Math.sqrt((o[0] - a[0]) * (o[0] - a[0]) + (o[1] - a[1]) * (o[1] - a[1]));
    const d2 = Math.sqrt((o[0] - b[0]) * (o[0] - b[0]) + (o[1] - b[1]) * (o[1] - b[1]));
    const d3 = Math.sqrt((o[0] - c[0]) * (o[0] - c[0]) + (o[1] - c[1]) * (o[1] - c[1]));
    me.helpInfo = {
        o, a, b, c,
        sina: (a[0] - o[0]) / d1,
        cosa: (a[1] - o[1]) / d1,
        sinb: (b[0] - o[0]) / d2,
        cosb: (b[1] - o[1]) / d2,
        sinc: (c[0] - o[0]) / d3,
        cosc: (c[1] - o[1]) / d3,
        axis2screen: axis2screen,
        local2world: local2world,
        screen2axis: wrapMathFunction('screen2axis', me)
    };
    me.helpers = drawLocalTranslator(me.helpInfo, me);
    attachCommonMouseHandler(me.helpers, 'pointer', 'fill');
}

function localRotater(me) {
    const axis = me.axis;
    const axis2screen = wrapMathFunction('axis2screen', me);
    const local2world = wrapLocal2worldFunction(me);
    const xoz = [], xoy = [], yoz = [];
    let p, i, r = 100 * me.size * me.cameraRadius / 1000;
    for (i = 0; i < 360; i += 10) {
        p = local2world(r * Math.cos(i * 0.01744), r * Math.sin(i * 0.01744), 0);
        xoy.push(axis2screen(p[axis[0]], p[axis[1]]));
        p = local2world(r * Math.cos(i * 0.01744), 0, r * Math.sin(i * 0.01744));
        xoz.push(axis2screen(p[axis[0]], p[axis[1]]));
        p = local2world(0, r * Math.cos(i * 0.01744), r * Math.sin(i * 0.01744));
        yoz.push(axis2screen(p[axis[0]], p[axis[1]]));
    }
    me.helpInfo = {
        faces: [
            [xoz, AXIS_COLOR.xoz, 'y'],
            [xoy, AXIS_COLOR.xoy, 'z'],
            [yoz, AXIS_COLOR.yoz, 'x']
        ],
        axis2screen: axis2screen,
        local2world: local2world,
        screen2axis: wrapMathFunction('screen2axis', me)
    };
    me.helpers = drawLocalRotater(me.helpInfo, me);
    attachCommonMouseHandler(me.helpers, 'e-resize', 'stroke');
}


export default {
    translate: {
        world: worldTranslator,
        local: localTranslator
    },
    rotate: {
        local: localRotater,
        world: localRotater
    }
};

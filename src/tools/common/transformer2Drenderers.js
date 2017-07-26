
define(function (require) {


    var AXIS_COLOR = {
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
    var handlerFactory = require('./handlerFactories');


    var exports = {
        translate: {
            world: function (me) {
                var axis = me.axis;
                var axis2screen = handlerFactory.math('axis2screen', me);
                var local2world = handlerFactory.local2world(me);
                var o = local2world(0, 0, 0);
                var a = {x: o.x, y: o.y, z: o.z}; a[axis[0]] += 100; a = axis2screen(a[axis[0]], a[axis[1]]);
                var b = {x: o.x, y: o.y, z: o.z}; b[axis[1]] += 100; b = axis2screen(b[axis[0]], b[axis[1]]); 
                o = axis2screen(o[axis[0]], o[axis[1]]);
                var d1 = Math.sqrt((o[0] - a[0]) * (o[0] - a[0]) + (o[1] - a[1]) * (o[1] - a[1]));
                var d2 = Math.sqrt((o[0] - b[0]) * (o[0] - b[0]) + (o[1] - b[1]) * (o[1] - b[1]));
                me.helpInfo = {
                    o: o,
                    a: a,
                    b: b,
                    sina: (a[0] - o[0]) / d1,
                    cosa: (a[1] - o[1]) / d1,
                    sinb: (b[0] - o[0]) / d2,
                    cosb: (b[1] - o[1]) / d2,
                    axis2screen: axis2screen,
                    local2world: local2world,
                    screen2axis: handlerFactory.math('screen2axis', me)
                };
                me.helpers = drawTranslatorWorld(me.helpInfo, me); 
                attachMouseHandlers(me.helpers, 'pointer', 'fill');
            },
            local: function (me) {
                var axis = me.axis;
                var axis2screen = handlerFactory.math('axis2screen', me);
                var local2world = handlerFactory.local2world(me);
                var o = local2world(0, 0, 0); o = axis2screen(o[axis[0]], o[axis[1]]);
                var a = local2world(100, 0, 0); a = axis2screen(a[axis[0]], a[axis[1]]);
                var b = local2world(0, 100, 0); b = axis2screen(b[axis[0]], b[axis[1]]);
                var c = local2world(0, 0, 100); c = axis2screen(c[axis[0]], c[axis[1]]); 
                var d1 = Math.sqrt((o[0] - a[0]) * (o[0] - a[0]) + (o[1] - a[1]) * (o[1] - a[1]));
                var d2 = Math.sqrt((o[0] - b[0]) * (o[0] - b[0]) + (o[1] - b[1]) * (o[1] - b[1]));
                var d3 = Math.sqrt((o[0] - c[0]) * (o[0] - c[0]) + (o[1] - c[1]) * (o[1] - c[1]));
                me.helpInfo = {
                    o: o,
                    a: a,
                    b: b,
                    c: c,
                    sina: (a[0] - o[0]) / d1,
                    cosa: (a[1] - o[1]) / d1,
                    sinb: (b[0] - o[0]) / d2,
                    cosb: (b[1] - o[1]) / d2,
                    sinc: (c[0] - o[0]) / d3,
                    cosc: (c[1] - o[1]) / d3,
                    axis2screen: axis2screen,
                    local2world: local2world,
                    screen2axis: handlerFactory.math('screen2axis', me)
                };
                me.helpers = drawTranslatorLocal(me.helpInfo, me);
                attachMouseHandlers(me.helpers, 'pointer', 'fill');
            }
        },
        rotate: {
            local: function (me) {
                var axis = me.axis;
                var axis2screen = handlerFactory.math('axis2screen', me);
                var local2world = handlerFactory.local2world(me);
                var xoz = [], xoy = [], yoz = [], p, i, r = 100 * me.size * me.cameraRadius / 1000;
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
                    screen2axis: handlerFactory.math('screen2axis', me)
                };
                me.helpers = drawCircle(me.helpInfo, me);
                attachMouseHandlers(me.helpers, 'e-resize', 'stroke');
            }
        }
    };


    exports.rotate.world = exports.rotate.local;


    return exports;


    // 绘制rotater 操作圆
    function drawCircle(info, me) {
        var style = {'stroke-width': 3};
        var result = [];
        info.faces.map(function (item, index) {
            result[index] = me.svg.path(circle(item[0])).attr(style).attr({stroke: item[1]})
                .mousedown(mousedownFactory(item[2], me));
        });
        return result;
    }


    // 绘制translator local
    function drawTranslatorLocal(info, me) {
        var a = arrow('a', info, me.size);
        var b = arrow('b', info, me.size);
        var c = arrow('c', info, me.size);
        var arr = [];
        if (available(a)) {
            arr.push(me.svg.path(a).attr({fill: AXIS_COLOR.x}).mousedown(mousedownFactory('a', me)));
        }
        if (available(b)) {
            arr.push(me.svg.path(b).attr({fill: AXIS_COLOR.y}).mousedown(mousedownFactory('b', me)));
        }
        if (available(c)) {
            arr.push(me.svg.path(c).attr({fill: AXIS_COLOR.z}).mousedown(mousedownFactory('c', me)));
        }
        return arr;
        function available(data) {
            var str = JSON.stringify(data).toLowerCase();
            return str.indexOf('null') < 0 && str.indexOf('nan') < 0;
        }
    }


    // 绘制translator world
    function drawTranslatorWorld(info, me) {
        var axis = me.axis;
        return [
            me.svg.path(face(info, me.size)).attr({fill: AXIS_COLOR[axis.join('')]}).mousedown(mousedownFactory('o', me)),
            me.svg.path(arrow('a', info, me.size)).attr({fill: AXIS_COLOR[axis[0]]}).mousedown(mousedownFactory(axis[0], me)),
            me.svg.path(arrow('b', info, me.size)).attr({fill: AXIS_COLOR[axis[1]]}).mousedown(mousedownFactory(axis[1], me))
        ];
    }


    // 箭头
    function arrow(axis, info, size) {
        var x0 = info.o[0];
        var y0 = info.o[1];
        var x1 = info[axis][0];
        var y1 = info[axis][1];
        var sin = info['sin' + axis];
        var cos = info['cos' + axis];
        var r = 2;
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


    // 操作面
    function face(info, size, ruleA, ruleB) {
        ruleA = ruleA || 'a';
        ruleB = ruleB || 'b';
        var x0 = info.o[0];
        var y0 = info.o[1];
        var x1 = info[ruleA][0];
        var y1 = info[ruleA][1];
        var x2 = info[ruleB][0];
        var y2 = info[ruleB][1];
        var x3 = 0;
        var y3 = 0;
        var sina = info['sin' + ruleA];
        var cosa = info['cos' + ruleA];
        var sinb = info['sin' + ruleB];
        var cosb = info['cos' + ruleB];
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


    // 圆环
    function circle(points) {
        var arr = [].concat(points, [points[0]]);
        var result = [];
        arr.map(function (p, i) {
            result.push([i === 0 ? 'M' : 'L', p[0], p[1]]);
        });
        return result;
    }


    function mousedownFactory(cmd, me) {
        return function () {
            me.command = cmd;
        }
    }


    function attachMouseHandlers(arr, cursor, type) {
        arr.map(function (item) {
            item.attr('cursor', cursor).mouseover(function() {
                this['___' + type + '___'] = this.attr(type);
                this.attr(type, '#FFFF00');
            }).mouseout(function() {
                this.attr(type, this['___' + type + '___']);
            });
        });
    }


});

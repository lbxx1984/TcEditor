
define(function (require) {

    var handlerFactory = require('./handlerFactories');
    var AXIS_COLOR = {
        x: '#FF1600',
        y: '#10FF00',
        z: '#0013FF'
    };

    return {
        translate: {
            world: function (me) {
                var axis = me.axis;
                var axis2screen = handlerFactory.math('axis2screen', me);
                var local2world = handlerFactory.local2world(me);
                var o = local2world(0, 0, 0);
                var a = {x: o.x, y: o.y, z: o.z};
                var b = {x: o.x, y: o.y, z: o.z};
                a[axis[0]] += 100;
                b[axis[1]] += 100;
                o = axis2screen(o[axis[0]], o[axis[1]]);
                a = axis2screen(a[axis[0]], a[axis[1]]);
                b = axis2screen(b[axis[0]], b[axis[1]]);
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
                // 平面
                me.helpers[me.helpers.length] = drawFace(me.helpInfo, me.svg, me.size).attr({
                    stroke: 'rgba(255, 255, 255, 0.5)',
                    fill: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer'
                }).mousedown(function() {
                    me.command = 'o';
                });
                // 轴1
                me.helpers[me.helpers.length] = drawArrow('a', me.helpInfo, me.svg, me.size).attr({
                    fill: AXIS_COLOR[axis[0]],
                    cursor: 'pointer'
                }).mousedown(function () {
                    me.command = axis[0];
                });
                // 轴2
                me.helpers[me.helpers.length] = drawArrow('b', me.helpInfo, me.svg, me.size).attr({
                    fill: AXIS_COLOR[axis[1]],
                    cursor: 'pointer'
                }).mousedown(function () {
                    me.command = axis[1];
                });
            },
            local: function (me) {}
        }
    };


    function drawArrow(axis, info, svg, size) {
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
        return svg.path([
            ['M', x0 + r * cos, y0 - r * sin],
            ['L', x1 + r * cos, y1 - r * sin],
            ['L', x1 + 3 * r * cos, y1 - 3 * r * sin],
            ['L', (3 * r + d) * sin + x0, (3 * r + d) * cos + y0],
            ['L', x1 - 3 * r * cos, y1 + 3 * r * sin],
            ['L', x1 - r * cos, y1 + r * sin],
            ['L', x0 - r * cos, y0 + r * sin],
            ['L', x0 + r * cos, y0 - r * sin],
            ['M', x0 + r * cos, y0 - r * sin]
        ]);
    }


    function drawFace(info, svg, size) {
        var x0 = info.o[0];
        var y0 = info.o[1];
        var x1 = info.a[0];
        var y1 = info.a[1];
        var x2 = info.b[0];
        var y2 = info.b[1];
        var x3 = 0;
        var y3 = 0;
        var sina = info.sina;
        var cosa = info.cosa;
        var sinb = info.sinb;
        var cosb = info.cosb;
        d1 = 50 * size;
        d2 = 50 * size;
        x1 = d1 * sina + x0;
        y1 = d1 * cosa + y0;
        x2 = d2 * sinb + x0;
        y2 = d2 * cosb + y0;
        x3 = d1 * sina + d2 * sinb + x0;
        y3 = d1 * cosa + d2 * cosb + y0;
        return svg.path([
            ['M', x0, y0],
            ['L', x1, y1],
            ['L', x3, y3],
            ['L', x2, y2],
            ['M', x0, y0]
        ]);
    }


});
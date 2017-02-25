/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var _ = require('underscore');
    var math = require('../tools/math');


    function updateGrid(me) {
        // 基础绘制数据
        var container = me.refs.container;
        var grid = me.refs.grid;
        var ctx = grid.getContext('2d');
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        var trans = [500, 100];
        var scale = 2;
        var rotate = 45;
        // 临时绘制数据
        var a, b, c, d, x0, x1, y0, y1, xArr, yArr;
        a = math.screen2axis(0, 0, width, height, trans, scale, rotate);
        b = math.screen2axis(width, 0, width, height, trans, scale, rotate);
        c =  math.screen2axis(width, height, width, height, trans, scale, rotate);
        d =  math.screen2axis(0, height, width, height, trans, scale, rotate);
        x0 = Math.min(a[0], b[0], c[0], d[0]);
        x1 = Math.max(a[0], b[0], c[0], d[0]);
        y0 = Math.min(a[1], b[1], c[1], d[1]);
        y1 = Math.max(a[1], b[1], c[1], d[1]);
        x0 = 50 * (parseInt(x0 / 50, 10) + (x0 > 0 ? 2 : -2));
        x1 = 50 * (parseInt(x1 / 50, 10) + (x1 > 0 ? 2 : -2));
        y0 = 50 * (parseInt(y0 / 50, 10) + (y0 > 0 ? 2 : -2));
        y1 = 50 * (parseInt(y1 / 50, 10) + (y1 > 0 ? 2 : -2));
        xArr = [x0];
        yArr = [y0];
        while (x0 + 50 <= x1) xArr.push(x0 = x0 + 50);
        while (y0 + 50 <= y1) yArr.push(y0 = y0 + 50);
        // 开始绘制
        grid.width = width;
        grid.height = height;
        ctx.clearRect(0, 0, width, height);
        xArr.map(function (x) {
            a = math.axis2screen(x, yArr[0], width, height, trans, scale, rotate);
            b = math.axis2screen(x, yArr[yArr.length - 1], width, height, trans, scale, rotate);
            draw(a[0], a[1], b[0], b[1], 1, '#858585');
            if (x === 0) {
                c = math.axis2screen(0, 0, width, height, trans, scale, rotate);
                d = math.axis2screen(0, yArr[yArr.length - 1], width, height, trans, scale, rotate);
                draw(c[0], c[1], d[0], d[1], 2, '#F00');
            }
        });
        yArr.map(function (y) {
            a = math.axis2screen(xArr[0], y, width, height, trans, scale, rotate);
            b = math.axis2screen(xArr[xArr.length - 1], y, width, height, trans, scale, rotate);
            draw(a[0], a[1], b[0], b[1], 1, '#858585');
            if (y === 0) {
                c = math.axis2screen(0, 0, width, height, trans, scale, rotate);
                d = math.axis2screen(xArr[xArr.length - 1], 0, width, height, trans, scale, rotate);
                draw(c[0], c[1], d[0], d[1], 2, 'green');
            }
        });
        function draw(x0, y0, x1, y1, lineWidth, color) {
            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }
    }


    return React.createClass({

        contextTypes: {
            dispatch: React.PropTypes.func
        },

        // @override
        getDefaultProps: function () {
            return {
                rotation: 0,
                lookAt: {x:0, y:0, z:0},
                zoom: 1000
            };
        },

        componentDidMount: function () {
            updateGrid(this);
        },

        componentWillReceiveProps: function (nextProps) {

        },

        componentWillUnmount: function () {

        },

        render: function () {
            var containerProps = {
                className: 'tc-stage',
                ref: 'container',
                style: this.props.style
            };
            return (
                <div {...containerProps}>
                    <canvas ref="grid" className="fixed-canvas"/>
                </div>
            );
        }
    });

});

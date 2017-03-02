/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var _ = require('underscore');
    var Grid2D = require('../tools/Grid2D');
    

    function updateGrid(nextProps, me) {
        if (
            nextProps.axis.join('') !== me.props.axis.join('')
            || nextProps.cameraRadius !== me.props.cameraRadius
            || nextProps.cameraLookAt !== me.props.cameraLookAt
            || nextProps.cameraAngleA !== me.props.cameraAngleA
            || nextProps.cameraAngleB !== me.props.cameraAngleB
            || nextProps.gridColor !== me.props.gridColor
            || nextProps.style.right !== me.props.style.right
        ) {
            me.refs.container.style.right = nextProps.style.right + 'px';
            me.grid2D.axis = nextProps.axis;
            me.grid2D.cameraRadius = nextProps.cameraRadius;
            me.grid2D.cameraLookAt = nextProps.cameraLookAt;
            me.grid2D.cameraAngleA = nextProps.cameraAngleA;
            me.grid2D.cameraAngleB = nextProps.cameraAngleB;
            me.grid2D.lineColor = nextProps.gridColor;
            me.grid2D.render();
        }
    }


    return React.createClass({

        contextTypes: {
            dispatch: React.PropTypes.func
        },

        // @override
        getDefaultProps: function () {
            return {
                axis: ['x', 'z'],
                cameraRadius: 1000,
                cameraAngleA: 40,
                cameraAngleB: 45,
                cameraLookAt: {x: 0, y: 0, z: 0},
                cameraMoveSpeed: 4,
                gridColor: '#8F908A',
                gridVisible: true
            };
        },

        componentDidMount: function () {
            var me = this;
            this.mousedown = false;
            this.mouseCurrent2D = {x: 0, y: 0};
            this.mouseCurrent3D = {x: 0, y: 0, z: 0};
            this.grid2D = new Grid2D({
                axis: this.props.axis,
                cameraRadius: this.props.cameraRadius,
                cameraLookAt: this.props.cameraLookAt,
                cameraAngleA: this.props.cameraAngleA,
                cameraAngleB: this.props.cameraAngleB,
                container: this.refs.container,
                canvas: this.refs.grid,
                lineColor: this.props.gridColor
            });
            this.grid2D.render();
            // 绑定事件
            this.refs.container.addEventListener('mousewheel', this.onMouseWheel);
            window.addEventListener('resize', this.onResize);
        },

        componentWillReceiveProps: function (nextProps) {
            updateGrid(nextProps, this);
        },

        componentWillUnmount: function () {
            this.refs.container.removeEventListener('mousewheel', this.onMouseWheel);
            window.removeEventListener('resize', this.onResize);
        },

        onMouseWheel: function (evt) {
            var r = this.props.cameraRadius - 0.2 * this.props.cameraRadius * evt.wheelDelta
                * this.props.cameraMoveSpeed / this.refs.container.offsetWidth;
            r = Math.max(r, 50);
            r = Math.min(r, 5000);
            this.context.dispatch('changeCamera3D', {cameraRadius: r});
            evt.stopPropagation();
            return false;
        },

        onResize: function () {
            this.grid2D.render();
        },

        onMouseMove: function (e) {
            var mouse2D = {x: e.clientX, y: e.clientY};
            var mouse3D = {x: 0, y: 0, z: 0};
            var tmpMouse3D = this.grid2D.getMouse3D(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            mouse3D[this.props.axis[0]] = tmpMouse3D[0];
            mouse3D[this.props.axis[1]] = tmpMouse3D[1];
            var mouseDelta2D = {
                x: mouse2D.x - this.mouseCurrent2D.x,
                y: mouse2D.y - this.mouseCurrent2D.y
            };
            var mouseDelta3D = {
                x: mouse3D.x - this.mouseCurrent3D.x,
                y: mouse3D.y - this.mouseCurrent3D.y,
                z: mouse3D.z - this.mouseCurrent3D.z
            };
            this.mouseCurrent2D = mouse2D;
            this.mouseCurrent3D = mouse3D;
            this.context.dispatch('changeMouse3D', mouse3D);
            var callbackParam = {
                event: e,
                cameraInfo: {
                    radius: this.props.cameraRadius,
                    angleA: this.props.cameraAngleA,
                    angleB: this.props.cameraAngleB,
                    lookAt: this.props.cameraLookAt
                },
                stage2D: this,
                mouseDown2D: this.mouseDown2D,
                mouseDown3D: this.mouseDown3D,
                mouseCurrent2D: mouse2D,
                mouseCurrent3D: mouse3D,
                mouseDelta2D: mouseDelta2D,
                mouseDelta3D: mouseDelta3D
            };
            // 拖拽命令
            if (this.props.tool && this.mousedown && !this.isCameraRotating) {
                this.context.dispatch(this.props.tool + '-2d', callbackParam, true);
                return;
            }
            // 普通鼠标移动
            if (this.props.tool && !this.isCameraRotating) {
                this.context.dispatch(this.props.tool + '-2d', callbackParam, false);
            }
        },

        onMouseDown: function (e) {
            var tmpMouse3D = this.grid2D.getMouse3D(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            this.mousedown = true;
            this.mouseDown2D = {x: e.clientX, y: e.clientY};
            this.mouseDown3D = {x: 0, y: 0, z: 0};
            this.mouseDown3D[this.props.axis[0]] = tmpMouse3D[0];
            this.mouseDown3D[this.props.axis[1]] = tmpMouse3D[1];
            this.mouseCurrent2D = {x: e.clientX, y: e.clientY};
            this.mouseCurrent3D = JSON.parse(JSON.stringify(this.mouseDown3D));
        },

        onMouseUp: function (e) {
            this.mousedown = false;
            this.mouseDown2D = {x: 0, y: 0};
            this.mouseDown3D = {x: 0, y: 0, z: 0};
            this.mouseCurrent2D = {x: 0, y: 0};
            this.mouseCurrent3D = {x: 0, y: 0, z: 0};
            // 发生了物体操作
            if (this.isDragging) {
                this.isDragging = false;
                return;
            }
            // 普通mouseup
            if (typeof this.props.tool === 'string') {
                this.context.dispatch(this.props.tool + '-2d', 'mouseup', this);
            }
        },

        render: function () {
            var containerProps = {
                className: 'tc-stage',
                ref: 'container',
                style: this.props.style,
                onMouseMove: this.onMouseMove,
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
                onContextMenu: this.onContextMenu
            };
            var gridCanvasProps = {
                ref: 'grid',
                className: 'fixed-canvas',
                style: this.props.gridVisible ? undefined : {
                    display: 'none'
                }
            };
            return (
                <div {...containerProps}>
                    <canvas {...gridCanvasProps}/>
                </div>
            );
        }
    });

});

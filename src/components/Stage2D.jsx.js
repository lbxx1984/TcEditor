/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var React = require('react');
    var Grid2D = require('../tools/Grid2D');
    var Renderer2D = require('../tools/Renderer2D');
    var Transformer2D = require('../tools/Transformer2D');
    var Morpher2D = require('../tools/Morpher2D');
    var raphael = require('raphael');


    var CAMERA_RADIUS_FOR_2D_SCALE = 0.5;


    function updateCamera(nextProps, me) {
        if (JSON.stringify(nextProps.style) !== JSON.stringify(me.props.style)) {
            setTimeout(function () {
                me.svgRenderer.setSize(me.refs.container.offsetWidth, me.refs.container.offsetHeight); 
            }, 10);
        }
        if (
            nextProps.axis.join('') !== me.props.axis.join('')
            || nextProps.cameraRadius !== me.props.cameraRadius
            || nextProps.cameraLookAt !== me.props.cameraLookAt
            || nextProps.cameraAngleA !== me.props.cameraAngleA
            || nextProps.cameraAngleB !== me.props.cameraAngleB
            || nextProps.style.right !== me.props.style.right
        ) {
            me.refs.container.style.right = nextProps.style.right + 'px';
            updateTools(me.renderer2D);
            updateTools(me.grid2D);
            updateTools(me.transformer2D);
            updateTools(me.morpher2D);
            me.grid2D.render();
            me.renderer2D.render();
            me.transformer2D.attach(me.transformer2D.mesh);
            me.morpher2D.attach(me.morpher2D.mesh);
            me.morpher2D.attachAnchor(me.morpher2D.index);
        }
        function updateTools(tool) {
            tool.axis = nextProps.axis;
            tool.cameraRadius = nextProps.cameraRadius / CAMERA_RADIUS_FOR_2D_SCALE;
            tool.cameraLookAt = me.grid2D.cameraLookAt = nextProps.cameraLookAt;
            tool.cameraAngleA = nextProps.cameraAngleA;
            tool.cameraAngleB = nextProps.cameraAngleB;
        }
    }


    function updateMesh(nextProps, me) {
        var needRenderer = false;
        if (_.keys(nextProps.mesh3d).join(';') !== _.keys(me.props.mesh3d).join(';')) {
            me.renderer2D.mesh3d = nextProps.mesh3d;
            needRenderer = true;
        }
        if (
            nextProps.timer !== me.props.timer
            && nextProps.selectedMesh
            && nextProps.selectedMesh.tc
            && nextProps.selectedMesh.tc.needUpdate
            && me.renderer2D.mesh2d[nextProps.selectedMesh.uuid]
        ) {
            nextProps.selectedMesh.tc.needUpdate--;
            me.renderer2D.mesh2d[nextProps.selectedMesh.uuid].update();
            needRenderer = true;
        }
        if (nextProps.selectedMesh !== me.props.selectedMesh) {
            needRenderer = true;
        }
        if (needRenderer) {
            me.renderer2D.render();
        }
    }


    function updateTransformer(nextProps, me) {
        if (nextProps.tool !== 'tool-pickGeometry' && me.props.tool === 'tool-pickGeometry') {
            me.transformer2D.detach();
        }
        if (nextProps.tool === 'tool-pickGeometry' && me.props.tool !== 'tool-pickGeometry' && nextProps.selectedMesh) {
            me.transformer2D.attach(nextProps.selectedMesh);
        }
        if (nextProps.tool === 'tool-pickGeometry' && nextProps.selectedMesh !== me.props.selectedMesh) {
            me.transformer2D.attach(nextProps.selectedMesh);
        }
        if (nextProps.tool === 'tool-pickGeometry' && nextProps.timer !== me.props.timer && me.transformer2D.mesh) {
            me.transformer2D.attach(me.transformer2D.mesh);
        }
        if (nextProps.transformer3Dinfo !== me.props.transformer3Dinfo) {
            me.transformer2D.size = nextProps.transformer3Dinfo.size;
            me.transformer2D.mode = nextProps.transformer3Dinfo.mode;
            me.transformer2D.space = nextProps.transformer3Dinfo.space;
            if (me.transformer2D.mesh) {
                me.transformer2D.attach(me.transformer2D.mesh);
            }
        }
    }


    function updateMorpher(nextProps, me) {
        if (nextProps.tool !== 'tool-pickJoint' && me.props.tool === 'tool-pickJoint') {
            me.morpher2D.detach();
        }
        if (nextProps.tool === 'tool-pickJoint' && me.props.tool !== 'tool-pickJoint' && nextProps.selectedMesh) {
            me.morpher2D.attach(nextProps.selectedMesh);
        }
        if (nextProps.tool === 'tool-pickJoint' && nextProps.selectedMesh !== me.props.selectedMesh) {
            me.morpher2D.attach(nextProps.selectedMesh);
        }
        if (nextProps.tool === 'tool-pickJoint' && nextProps.timer !== me.props.timer && me.morpher2D.mesh) {
            me.morpher2D.attach(me.morpher2D.mesh);
            if (me.morpher2D.index) {
                me.morpher2D.attachAnchor(me.morpher2D.index);
            }
        }
        if (nextProps.tool === 'tool-pickJoint' && nextProps.selectedVectorIndex !== me.props.selectedVectorIndex) {
            me.morpher2D.attachAnchor(nextProps.selectedVectorIndex);
        }
        if (nextProps.morpher3Dinfo !== me.props.morpher3Dinfo) {
            me.morpher2D.color = nextProps.morpher3Dinfo.anchorColor;
            me.morpher2D.size = nextProps.morpher3Dinfo.anchorSize;
            if (me.morpher2D.mesh) {
                me.morpher2D.attach(me.morpher2D.mesh);
            }
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
            this.svgRenderer = raphael(this.refs.svg, this.refs.container.offsetWidth, this.refs.container.offsetHeight);
            this.grid2D = new Grid2D({
                axis: this.props.axis,
                cameraRadius: this.props.cameraRadius / CAMERA_RADIUS_FOR_2D_SCALE,
                cameraLookAt: this.props.cameraLookAt,
                cameraAngleA: this.props.cameraAngleA,
                cameraAngleB: this.props.cameraAngleB,
                container: this.refs.container,
                canvas: this.refs.grid,
                lineColor: this.props.gridColor
            });
            this.renderer2D = new Renderer2D({
                axis: this.props.axis,
                cameraRadius: this.props.cameraRadius / CAMERA_RADIUS_FOR_2D_SCALE,
                cameraLookAt: this.props.cameraLookAt,
                cameraAngleA: this.props.cameraAngleA,
                cameraAngleB: this.props.cameraAngleB,
                container: this.refs.container,
                canvas: this.refs.renderer,
                mesh3d: this.props.mesh3d
            });
            this.morpher2D = new Morpher2D({
                axis: this.props.axis,
                cameraRadius: this.props.cameraRadius / CAMERA_RADIUS_FOR_2D_SCALE,
                cameraLookAt: this.props.cameraLookAt,
                cameraAngleA: this.props.cameraAngleA,
                cameraAngleB: this.props.cameraAngleB,
                svg: this.svgRenderer,
                container: this.refs.container,
                size: this.props.morpher3Dinfo.anchorSize,
                color: this.props.morpher3Dinfo.anchorColor,
                onAnchorClick: function (i) {me.context.dispatch('morpher-2d-pick-anchor', i);}
            });
            this.transformer2D = new Transformer2D({
                axis: this.props.axis,
                cameraRadius: this.props.cameraRadius / CAMERA_RADIUS_FOR_2D_SCALE,
                cameraLookAt: this.props.cameraLookAt,
                cameraAngleA: this.props.cameraAngleA,
                cameraAngleB: this.props.cameraAngleB,
                svg: this.svgRenderer,
                container: this.refs.container,
                mode: this.props.transformer3Dinfo.mode,
                size: this.props.transformer3Dinfo.size,
                space: this.props.transformer3Dinfo.space,
                onChange: function () {
                    if (me.props.selectedMesh && me.props.selectedMesh.tc) {
                        me.props.selectedMesh.tc.needUpdate = me.props.view === 'view-all' ? 3 : 1;
                        me.context.dispatch('updateTimer');
                    }
                }
            });
            // 初始化舞台
            this.grid2D.render();
            this.renderer2D.render();
            if (this.props.tool === 'tool-pickGeometry' && this.props.selectedMesh) {
                this.transformer2D.attach(this.props.selectedMesh);
            }
            if (this.props.tool === 'tool-pickJoint' && this.props.selectedMesh) {
                this.morpher2D.attach(this.props.selectedMesh);
                this.morpher2D.attachAnchor(this.props.selectedVectorIndex);
            }
            // 绑定事件
            this.refs.container.addEventListener('mousewheel', this.onMouseWheel);
            window.addEventListener('resize', this.onResize);
        },

        componentWillReceiveProps: function (nextProps) {
            updateCamera(nextProps, this);
            updateMesh(nextProps, this);
            updateTransformer(nextProps, this);
            updateMorpher(nextProps, this);
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
            this.renderer2D.render();
            this.svgRenderer.setSize(this.refs.container.offsetWidth, this.refs.container.offsetHeight);
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

        onContextMenu: function (e) {
            this.context.dispatch('stage3d-context-menu');
            e.stopPropagation();
            e.preventDefault();
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
            var rendererCanvasProps = {
                ref: 'renderer',
                className: 'fixed-canvas'
            };
            var svgProps = {
                ref: 'svg',
                className: 'fixed-canvas'
            };
            return (
                <div {...containerProps}>
                    <canvas {...gridCanvasProps}/>
                    <canvas {...rendererCanvasProps}/>
                    <div {...svgProps}></div>
                </div>
            );
        }
    });

});
